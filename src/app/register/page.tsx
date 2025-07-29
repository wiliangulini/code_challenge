import Link from 'next/link'
import RegisterForm from '@/components/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Criar conta</h2>
        <RegisterForm />
        <p className="mt-4 text-sm text-center">
          Já tem uma conta? <Link href="/login" className="text-blue-600 hover:underline">Faça login</Link>
        </p>
      </div>
    </div>
  )
}