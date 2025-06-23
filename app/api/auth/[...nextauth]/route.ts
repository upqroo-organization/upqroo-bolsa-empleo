import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { Adapter } from 'next-auth/adapters';

// Define la configuración de NextAuth
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter, // Asegura que es compatible
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // Este callback se ejecuta en cada login
    async signIn({ user }) {
      if (!user.email) return false;

      const existingUser = await prisma.usuario.findUnique({
        where: { email: user.email },
        include: { persona: true },
      });

      if (!existingUser) {
        // Usuario no existe en nuestra tabla personalizada, lo creamos
        await prisma.usuario.create({
          data: {
            email: user.email,
            contraseña_hash: '', // OAuth no usa contraseña
            tipo_usuario: 'persona',
            foto_url: user.image ?? null,
            persona: {
              create: {
                nombre: user.name?.split(' ')[0] ?? 'Nombre',
                apellidos: user.name?.split(' ').slice(1).join(' ') ?? 'Apellido',
                tipo_persona: 'publico',
              },
            },
          },
        });
      }

      return true;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },

    async jwt({ token, user }) {
      // Solo se llena al momento del login
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Exporta el handler como API de Next.js (GET y POST)
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
