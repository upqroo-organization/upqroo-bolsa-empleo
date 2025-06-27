// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma' // We'll create this

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // session: {
  //   strategy: 'database',
  // },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // This runs on sign-in and every request
      if (account && user) {
        // Fetch user role from your DB here
        const dbUser = "admin"; // ← Replace this with your DB call
        token.role = dbUser;
      }
      return token;
    },
    async session({ session, user }) {
      // Add user type to session
      session.user = user
      return session
    }
  },
})

export { handler as GET, handler as POST }
