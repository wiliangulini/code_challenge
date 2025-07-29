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

// GET - Listar todos os itens
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = readDb()
    return NextResponse.json(db.items)
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST - Criar novo item
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { nome, descricao, localizacao, status } = body

    if (!nome || !descricao || !localizacao || !status) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    const db = readDb()
    const newItem = {
      id: Date.now().toString(),
      nome,
      descricao,
      localizacao,
      status,
      createdAt: new Date().toISOString(),
      createdBy: user.name
    }

    db.items.push(newItem)
    writeDb(db)

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
