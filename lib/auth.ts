import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { NextAuthOptions } from 'next-auth'

// Extend NextAuth Session type to include role
// If you need additional properties, you can extend the Session interface here
// This is necessary to ensure TypeScript recognizes the custom properties
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string;
      role?: string | null;
    }
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Empresa",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const company = await prisma.company.findUnique({
          where: { email: credentials?.email },
          include: { role: true }
        });

        if (!company) {
          throw new Error("Correo no encontrado");
        }

        const isValid = await bcrypt.compare(
          credentials!.password,
          company.password || ""
        );

        if (!isValid) {
          throw new Error("Contraseña incorrecta");
        }

        return {
          id: company.id,
          name: company.name,
          email: company.email,
          role: company.role?.name,
        };
      }
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect errors to login page
  },
  events: {
    async createUser(user) {
      // This is triggered only once for a new user
      let defaultRole;
      if(user.user.email === process.env.COORDINATOR_MAIL) {
        defaultRole = await prisma.role.findUnique({
          where: { name: 'coordinator' },
        })
      } else if (user.user.email?.includes('@upqroo.edu.mx')) {
        defaultRole = await prisma.role.findUnique({
          where: { name: 'student' },
        })
      } else {
        defaultRole = await prisma.role.findUnique({
          where: { name: 'external' },
        })
      }

      if (defaultRole) {
        try {
          await prisma.user.update({
            where: { id: user.user.id },
            data: {
              role: {
                connect: { id: defaultRole.id },
              },
            },
          });
        } catch (error) {
          console.error('Error assigning default role to user:', error);
        }
      } else {
        console.warn('Default role student not found.');
      }
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        // Try to get role from User table
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { role: true }
        });

        if (dbUser?.role?.name) {
          token.role = dbUser.role.name;
        } else {
          // If not found in User, try Company
          const dbCompany = await prisma.company.findUnique({
            where: { id: user.id },
            include: { role: true }
          });

          if (dbCompany?.role?.name) {
            token.role = dbCompany.role.name;
            token.isApproved = dbCompany.isApprove; // Add approval status to token
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token?.role) {
        session.user.role = token.role as string;
        session.user.id = token.sub as string; // Ensure user ID is set
      }
      return session;
    },
  }
}
