import { ItemStatus } from '@/types/item'
import { z } from 'zod'

export const itemSchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().min(1),
  localizacao: z.string().min(1),
  status: z.enum(ItemStatus),
})