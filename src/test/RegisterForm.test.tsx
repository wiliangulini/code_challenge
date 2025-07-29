import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RegisterForm from '@/components/RegisterForm'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }))

describe('RegisterForm', () => {
  const pushMock = jest.fn()

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
    fetchMock.resetMocks()
  })

  it('deve mostrar erros de validação', async () => {
    render(<RegisterForm />)
    fireEvent.click(screen.getByRole('button', { name: /registrar/i }))

    await waitFor(() => {
      expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument()
    })
  })

  it('deve mostrar erro de incompatibilidade de senha', async () => {
    render(<RegisterForm />)
    fireEvent.change(screen.getByPlaceholderText(/nome/i), { target: { value: 'Test' } })
    fireEvent.change(screen.getByPlaceholderText(/e-mail/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: '123456' } })
    fireEvent.change(screen.getByPlaceholderText('Confirmar Senha'), { target: { value: '654321' } })

    fireEvent.click(screen.getByRole('button', { name: /registrar/i }))

    await waitFor(() => {
      expect(screen.getByText(/senhas não coincidem/i)).toBeInTheDocument()
    })
  })
})