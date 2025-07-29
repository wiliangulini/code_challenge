export enum MaintenanceType {
  PREVENTIVA = 'Preventiva',
  CORRETIVA = 'Corretiva',
  EMERGENCIAL = 'Emergencial'
}

export interface Maintenance {
  id: string
  itemId: string
  performedAt: string
  type: MaintenanceType
  description: string
  technician: string
  nextScheduled?: string
  itemName?: string
  createdAt?: string
}