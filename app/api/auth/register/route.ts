import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  alias: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, alias } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { alias }
        ]
      }
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: "Alias already taken" },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user and virtual account in transaction
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        alias,
        accounts: {
          create: {
            name: "Main Account",
            initialBalance: 50000,
            currentBalance: 50000,
            equity: 50000,
          }
        }
      },
      include: {
        accounts: true
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        alias: user.alias,
        accountId: user.accounts[0].id
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
