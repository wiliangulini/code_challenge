import { prismaMock } from '@/lib/prismaMock'
import { createMaintenance } from '@/services/maintenanceService'

describe('createMaintenance', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve criar manutenção e atualizar status do item', async () => {
    const mockMaintenance = {
      id: 'm1',
      itemId: 'i1',
      description: 'Troca de óleo',
      performedBy: 'João',
    }

    const mockMaintenanceResult = {
      ...mockMaintenance,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    ;(prismaMock.maintenance.create as jest.Mock).mockResolvedValue(mockMaintenanceResult)
    ;(prismaMock.item.update as jest.Mock).mockResolvedValue({ id: 'i1', status: 'DISPONIVEL' })

    const result = await createMaintenance(mockMaintenance as any)

    expect(prismaMock.maintenance.create).toHaveBeenCalled()
    expect(prismaMock.item.update).toHaveBeenCalled()
    expect(result).toEqual(mockMaintenanceResult)
  })
})
