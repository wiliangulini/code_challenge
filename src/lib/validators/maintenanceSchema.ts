import { z } from 'zod';

export const maintenanceSchema = z.object({
  itemId: z.string().uuid(),
  performedAt: z.string().min(1),
  description: z.string().min(3),
  technician: z.string().min(3)
});

export type MaintenanceFormData = z.infer<typeof maintenanceSchema>;