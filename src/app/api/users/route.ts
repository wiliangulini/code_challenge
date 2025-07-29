import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import fs from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'backend', 'db.json')

interface JwtPayload {
  id: number
  email: string
  name: string
  role: string
}

async function verifyToken(request: NextRequest) {
  const authorization = request.headers.get('authorization')
  if (!authorization?.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authorization.split(' ')[1]
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as JwtPayload
  } catch {
    return null
  }
}

function readDb() {
  const data = fs.readFileSync(dbPath, 'utf8')
  return JSON.parse(data)
}

function writeDb(data: any) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

// GET - Listar todos os usuários (apenas ADMIN)
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const db = readDb()
    // Remove senhas dos dados retornados
    const users = db.users.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }))

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
