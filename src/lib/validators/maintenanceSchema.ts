import { z } from 'zod'
import { MaintenanceType } from '@/types/maintenance'

export const maintenanceSchema = z.object({
  itemId: z.string().min(1, 'Item é obrigatório'),
  type: z.nativeEnum(MaintenanceType, {
    message: 'Tipo de manutenção é obrigatório'
  }),
  performedAt: z.string().min(1, 'Data é obrigatória'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  technician: z.string().min(2, 'Nome do técnico deve ter pelo menos 2 caracteres'),
  nextScheduled: z.string().optional()
})

export type MaintenanceFormData = z.infer<typeof maintenanceSchema>