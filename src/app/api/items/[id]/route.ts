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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = readDb()
    const item = db.items.find((item: any) => item.id === id)

    if (!item) {
      return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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
    const itemIndex = db.items.findIndex((item: any) => item.id === id)

    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
    }

    db.items[itemIndex] = {
      ...db.items[itemIndex],
      nome,
      descricao,
      localizacao,
      status,
      updatedAt: new Date().toISOString(),
      updatedBy: user.name
    }

    writeDb(db)

    return NextResponse.json(db.items[itemIndex])
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const db = readDb()
    const itemIndex = db.items.findIndex((item: any) => item.id === id)

    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
    }

    db.maintenance = db.maintenance.filter((m: any) => m.itemId !== id)
    db.items.splice(itemIndex, 1)
    writeDb(db)

    return NextResponse.json({ message: 'Item excluído com sucesso' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
