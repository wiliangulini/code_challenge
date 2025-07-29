import { render } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/context/AuthContext'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

describe('AuthContext', () => {
  it('deve inicializar com usuário nulo', () => {
    let ctxUser = null
    const TestComponent = () => {
      const { user } = useAuth()
      ctxUser = user
      return <span>Test</span>
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(ctxUser).toBeNull()
  })
})
