import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function randomAlias() {
  const n = Math.floor(Math.random() * 100000)
  return `guest${n}`
}

export async function POST(req: Request) {
  try {
    const alias = randomAlias()
    const user = await prisma.user.create({ data: { email: `${alias}@example.local`, passwordHash: "", alias, isPublic: false, accounts: { create: { name: "Guest Account", initialBalance: 50000, currentBalance: 50000, equity: 50000 } } }, include: { accounts: true } })
    return NextResponse.json({ success: true, user: { id: user.id, alias: user.alias, accountId: user.accounts[0].id } })
  } catch (error) {
    console.error("Error creating guest:", error)
    return NextResponse.json({ error: "Failed to create guest" }, { status: 500 })
  }
}
