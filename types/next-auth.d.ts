import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      alias: string
      name?: string
      image?: string
    }
  }

  interface User {
    id: string
    email: string
    alias: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    alias: string
  }
}
