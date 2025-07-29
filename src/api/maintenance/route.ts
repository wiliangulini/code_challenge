import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { maintenanceSchema } from '@/lib/validators/maintenanceSchema'
import { NextRequest, NextResponse } from 'next/server'
import { ItemStatus } from '@/types/item'


export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const result = maintenanceSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  const { itemId, description, performedAt } = result.data

  const maintenance = await prisma.maintenance.create({
    data: {
      itemId,
      description,
      performedAt,
      userId: user.id,
    },
  })

  // Atualiza o status do item para "OPERACAO" após manutenção
  await prisma.item.update({
    where: { id: itemId },
    data: {
      status: ItemStatus.OPERACAO,
    },
  })

  return NextResponse.json(maintenance, { status: 201 })
}
