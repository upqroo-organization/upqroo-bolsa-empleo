import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

// Extend the Session and User types to include 'id'
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Solo permitimos registro de personas
      await prisma.usuario.upsert({
        where: { email: user.email! },
        update: {}, // ya existe
        create: {
          email: user.email!,
          contraseña_hash: '', // no aplica con OAuth
          tipo_usuario: 'persona',
          foto_url: user.image,
          persona: {
            create: {
              nombre: user.name?.split(' ')[0] ?? '',
              apellidos: user.name?.split(' ').slice(1).join(' ') ?? '',
              tipo_persona: 'publico',
            },
          },
        },
      });

      return true;
    },
    async session({ session, user }) {
      // Puedes extender la sesión con más info si lo deseas
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // puedes personalizar tu login
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
