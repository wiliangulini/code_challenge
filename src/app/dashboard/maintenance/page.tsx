'use client';

import { useEffect, useState } from 'react';
import { Maintenance } from '@/types/maintenance';
import { MaintenanceForm } from '@/components/MaintenanceForm';

export default function MaintenancePage() {
  const [data, setData] = useState<Maintenance[]>([]);

  const loadData = async () => {
    const res = await fetch('/api/maintenance');
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Manutenções</h1>

      <MaintenanceForm onSuccess={loadData} itemId={''} />

      <ul className="space-y-2">
        {data.map((m) => (
          <li key={m.id} className="border p-2 rounded">
            <p><strong>Item:</strong> {m.itemId}</p>
            <p><strong>Data:</strong> {m.performedAt}</p>
            <p><strong>Técnico:</strong> {m.technician}</p>
            <p><strong>Descrição:</strong> {m.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}