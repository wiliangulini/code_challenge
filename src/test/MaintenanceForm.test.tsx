import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MaintenanceForm } from '@/components/MaintenanceForm'
import { AlertProvider } from '@/context/AlertContext'
import * as itemService from '@/services/itemService'

jest.mock('@/services/itemService')
jest.mock('js-cookie', () => ({
  get: jest.fn(() => 'mock-token')
}))

const mockGetItems = itemService.getItems as jest.MockedFunction<typeof itemService.getItems>

describe('MaintenanceForm', () => {
  beforeEach(() => {
    mockGetItems.mockResolvedValue([
      { id: 'item-1', nome: 'Item Test', localizacao: 'Location Test' }
    ] as any)

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    ) as jest.Mock
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('deve enviar com dados válidos', async () => {
    const onSuccess = jest.fn()

    render(
      <AlertProvider>
        <MaintenanceForm itemId="item-1" onSuccess={onSuccess} />
      </AlertProvider>
    )

    await waitFor(() => {
      expect(screen.getByRole('option', { name: /item test - location test/i })).toBeInTheDocument()
    })

    const itemSelect = screen.getByDisplayValue('Selecione um item...')
    fireEvent.change(itemSelect, {
      target: { value: 'item-1' },
    })

    fireEvent.change(screen.getByPlaceholderText(/descreva o serviço realizado/i), {
      target: { value: 'Troca de óleo' },
    })
    fireEvent.change(screen.getByPlaceholderText(/nome do técnico responsável/i), {
      target: { value: 'João Silva' },
    })

    fireEvent.click(screen.getByRole('button', { name: /registrar manutenção/i }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token'
        },
        body: expect.stringContaining('Troca de óleo')
      })
    })
  })
})
