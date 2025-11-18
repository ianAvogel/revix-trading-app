import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import { getCurrentPrice } from "./market-data"
import { Decimal } from "@prisma/client/runtime/library"

export interface TradeParams {
  accountId: string
  symbol: string
  side: "BUY" | "SELL"
  type: "MARKET" | "LIMIT"
  quantity: number
  limitPrice?: number
  signalId?: string
  mentorSuggested?: boolean
  userId?: string
}

export interface TradeResult {
  success: boolean
  trade?: any
  error?: string
}

const FEE_RATE = 0.001 // 0.1% fee
const MAX_SLIPPAGE = 0.003 // 0.3% max slippage

/**
 * Execute a trade (paper trading simulation)
 */
export async function executeTrade(params: TradeParams): Promise<TradeResult> {
  try {
    // Get account
    const account = await prisma.virtualAccount.findUnique({
      where: { id: params.accountId },
      include: { positions: { where: { symbol: params.symbol, isOpen: true } } }
    })

    if (!account || !account.isActive) {
      return { success: false, error: "Account not found or inactive" }
    }

    // Get current market price
    const currentPrice = await getCurrentPrice(params.symbol)
    if (!currentPrice || currentPrice <= 0) {
      return { success: false, error: "Unable to fetch market price" }
    }

    // Calculate execution price with simulated slippage
    const slippagePercent = Math.random() * MAX_SLIPPAGE
    const slippageMultiplier = params.side === "BUY"
      ? (1 + slippagePercent)
      : (1 - slippagePercent)

    const executionPrice = params.type === "LIMIT" && params.limitPrice
      ? params.limitPrice
      : currentPrice * slippageMultiplier

    // Validate limit order
    if (params.type === "LIMIT") {
      if (!params.limitPrice) {
        return { success: false, error: "Limit price required for limit orders" }
      }

      const priceDeviation = Math.abs(params.limitPrice - currentPrice) / currentPrice
      if (priceDeviation > 0.1) {
        return { success: false, error: "Limit price too far from market price (>10%)" }
      }
    }

    // Calculate costs
    const totalCost = executionPrice * params.quantity
    const fee = totalCost * FEE_RATE
    const totalWithFee = params.side === "BUY"
      ? totalCost + fee
      : totalCost - fee

    // Validate BUY order
    if (params.side === "BUY") {
      if (Number(account.currentBalance) < totalWithFee) {
        return {
          success: false,
          error: `Insufficient balance. Need $${totalWithFee.toFixed(2)}, have $${Number(account.currentBalance).toFixed(2)}`
        }
      }
    }

    // Validate SELL order
    if (params.side === "SELL") {
      const position = account.positions.find((p: any) => p.symbol === params.symbol && p.isOpen)
      if (!position || Number(position.quantity) < params.quantity) {
        return {
          success: false,
          error: `Insufficient position. Trying to sell ${params.quantity}, have ${position ? Number(position.quantity) : 0}`
        }
      }
    }

    // Execute trade in transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Create trade record
      const trade = await tx.trade.create({
        data: {
          accountId: params.accountId,
          symbol: params.symbol,
          side: params.side,
          type: params.type,
          quantity: new Decimal(params.quantity),
          price: new Decimal(executionPrice),
          slippage: new Decimal(slippagePercent),
          fee: new Decimal(fee),
          total: new Decimal(totalWithFee),
          status: "EXECUTED",
          signalId: params.signalId,
          mentorSuggested: params.mentorSuggested || false,
        }
      })

      // Update account balance
      if (params.side === "BUY") {
        await tx.virtualAccount.update({
          where: { id: params.accountId },
          data: {
            currentBalance: {
              decrement: new Decimal(totalWithFee)
            }
          }
        })

        // Create or update position
        const existingPosition = account.positions.find((p: any) => p.symbol === params.symbol && p.isOpen)

        if (existingPosition) {
          // Update existing position (average price)
          const currentQty = Number(existingPosition.quantity)
          const currentPrice = Number(existingPosition.entryPrice)
          const newTotalQty = currentQty + params.quantity
          const newAvgPrice = ((currentQty * currentPrice) + (params.quantity * executionPrice)) / newTotalQty

          await tx.position.update({
            where: { id: existingPosition.id },
            data: {
              quantity: new Decimal(newTotalQty),
              entryPrice: new Decimal(newAvgPrice),
              currentPrice: new Decimal(currentPrice),
            }
          })
        } else {
          // Create new position
          await tx.position.create({
            data: {
              accountId: params.accountId,
              symbol: params.symbol,
              side: "LONG",
              quantity: new Decimal(params.quantity),
              entryPrice: new Decimal(executionPrice),
              currentPrice: new Decimal(currentPrice),
              unrealizedPnl: new Decimal(0),
            }
          })
        }
      } else {
        // SELL - update position and balance
        await tx.virtualAccount.update({
          where: { id: params.accountId },
          data: {
            currentBalance: {
              increment: new Decimal(totalWithFee)
            }
          }
        })

        const position = account.positions.find((p: any) => p.symbol === params.symbol && p.isOpen)!
        const newQty = Number(position.quantity) - params.quantity
        const pnl = (executionPrice - Number(position.entryPrice)) * params.quantity

        if (newQty <= 0) {
          // Close position
          await tx.position.update({
            where: { id: position.id },
            data: {
              quantity: new Decimal(0),
              isOpen: false,
              closedAt: new Date(),
              realizedPnl: new Decimal(pnl),
            }
          })
        } else {
          // Reduce position
          await tx.position.update({
            where: { id: position.id },
            data: {
              quantity: new Decimal(newQty),
              currentPrice: new Decimal(currentPrice),
              realizedPnl: {
                increment: new Decimal(pnl)
              }
            }
          })
        }
      }

      // Create audit entry
      const auditDetails = {
        accountId: params.accountId,
        symbol: params.symbol,
        side: params.side,
        type: params.type,
        quantity: params.quantity,
        price: executionPrice,
        fee: fee,
        slippage: slippagePercent,
        performedAt: new Date().toISOString(),
      }

      const serverHash = crypto
        .createHash("sha256")
        .update(JSON.stringify(auditDetails))
        .digest("hex")

      await tx.tradeAudit.create({
        data: {
          tradeId: trade.id,
          action: "CREATED",
          actor: "USER",
          actorId: params.userId || params.accountId,
          details: auditDetails,
          serverHash,
        }
      })

      return trade
    })

    return { success: true, trade: result }
  } catch (error) {
    console.error("Trade execution error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Trade execution failed"
    }
  }
}

/**
 * Calculate unrealized PnL for all open positions
 */
export async function updatePositionPnL(accountId: string) {
  try {
    const positions = await prisma.position.findMany({
      where: { accountId, isOpen: true }
    })

    for (const position of positions) {
      const currentPrice = await getCurrentPrice(position.symbol)
      const unrealizedPnl = (currentPrice - Number(position.entryPrice)) * Number(position.quantity)

      await prisma.position.update({
        where: { id: position.id },
        data: {
          currentPrice: new Decimal(currentPrice),
          unrealizedPnl: new Decimal(unrealizedPnl),
        }
      })
    }

    // Update account equity
    const updatedPositions = await prisma.position.findMany({
      where: { accountId, isOpen: true }
    })

    const totalUnrealizedPnl = updatedPositions.reduce(
      (sum: number, p: any) => sum + Number(p.unrealizedPnl),
      0
    )

    const account = await prisma.virtualAccount.findUnique({
      where: { id: accountId }
    })

    if (account) {
      const equity = Number(account.currentBalance) + totalUnrealizedPnl

      await prisma.virtualAccount.update({
        where: { id: accountId },
        data: { equity: new Decimal(equity) }
      })
    }
  } catch (error) {
    console.error("Error updating position PnL:", error)
  }
}
