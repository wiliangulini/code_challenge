// MaintenanceService.test.ts

import { prismaMock } from "@/lib/prismaMock"
import { createMaintenance } from "@/services/maintenanceService"



describe('createMaintenance', () => {
  it('deve criar manutenção e atualizar status do item', async () => {
    const mockMaintenance = {
      id: 'm1',
      itemId: 'i1',
      description: 'Troca de peça',
      date: '2025-07-27',
      performedBy: 'João',
    }

    prismaMock.maintenance.create.mockResolvedValue(mockMaintenance)
    prismaMock.item.update.mockResolvedValue({ id: 'i1', status: 'DISPONIVEL' })

    const result = await createMaintenance(mockMaintenance)

    expect(prismaMock.maintenance.create).toHaveBeenCalled()
    expect(prismaMock.item.update).toHaveBeenCalled()
    expect(result).toEqual(mockMaintenance)
  })
})
