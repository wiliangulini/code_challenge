import { prisma } from '@/lib/prisma'
import { ItemStatus } from '@/types/item'

export async function createMaintenance(data: {
  itemId: string
  description: string
  date: string
  performedBy: string
}) {
  const maintenance = await prisma.maintenance.create({
    data,
  })

  await prisma.item.update({
    where: { id: data.itemId },
    data: { status: ItemStatus.OPERACAO },
  })

  return maintenance
}
