// types/next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth";

// Extiende el módulo de 'next-auth'
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
  }
}

// Extiende el token JWT si lo estás usando
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
