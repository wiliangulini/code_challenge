import { render } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/context/AuthContext'

describe('AuthContext', () => {
  it('should initialize with null user', () => {
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
