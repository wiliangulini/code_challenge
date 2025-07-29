'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { maintenanceSchema, MaintenanceFormData } from '@/lib/validators/maintenanceSchema';


type MaintenanceFormProps = {
  itemId: string
  onSuccess?: () => void
  onSubmit?: (data: MaintenanceFormData) => void // <== Adiciona essa linha
}

export function MaintenanceForm({ itemId, onSuccess }: MaintenanceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema)
  });

  const onSubmit = async (data: MaintenanceFormData) => {
    const res = await fetch('/api/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      reset();
      onSuccess?.();
    } else {
      alert('Erro ao registrar manutenção');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('itemId')} placeholder="ID do Item" className="input" />
      {errors.itemId && <p className="text-red-500">{errors.itemId.message}</p>}

      <input {...register('performedAt')} placeholder="Data" className="input" type="date" />
      {errors.performedAt && <p className="text-red-500">{errors.performedAt.message}</p>}

      <textarea {...register('description')} placeholder="Descrição" className="textarea" />
      {errors.description && <p className="text-red-500">{errors.description.message}</p>}

      <input {...register('technician')} placeholder="Técnico" className="input" />
      {errors.technician && <p className="text-red-500">{errors.technician.message}</p>}

      <button type="submit" disabled={isSubmitting} className="btn btn-primary">
        Registrar Manutenção
      </button>
    </form>
  );
}