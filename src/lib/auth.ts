import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura'

export async function getAuthUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    const user = await prisma.user.findUnique({ where: { id: decoded.id } })
    return user
  } catch (err) {
    return null
  }
}
