import { render, screen, fireEvent } from '@testing-library/react'
import { MaintenanceForm } from '@/components/MaintenanceForm'

describe('MaintenanceForm', () => {
  it('should submit with valid data', async () => {
    const handleSubmit = jest.fn()

    render(<MaintenanceForm onSubmit={handleSubmit} itemId="item-123" />)

    fireEvent.change(screen.getByLabelText(/descrição/i), {
      target: { value: 'Troca de óleo' },
    })
    fireEvent.change(screen.getByLabelText(/data/i), {
      target: { value: '2025-07-27' },
    })

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }))

    expect(await screen.findByText(/salvar/i)).toBeInTheDocument()
  })
})
