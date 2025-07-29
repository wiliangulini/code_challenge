import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { maintenanceSchema } from '@/lib/validators/maintenanceSchema'
import { ItemStatus } from '@/types/item'
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

// GET - Listar todas as manutenções
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = readDb()
    return NextResponse.json(db.maintenance)
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST - Criar nova manutenção
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const result = maintenanceSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: result.error.issues },
        { status: 400 }
      )
    }

    const { itemId, type, description, performedAt, technician, nextScheduled } = result.data

    const db = readDb()
    
    // Verifica se o item existe (converte tipos para comparação)
    const item = db.items.find((item: any) => 
      String(item.id) === String(itemId) || item.id === itemId
    )
    if (!item) {
      console.log('Item procurado:', itemId, 'Itens disponíveis:', db.items.map((i: any) => ({ id: i.id, type: typeof i.id })))
      return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
    }

    const newMaintenance = {
      id: Date.now().toString(),
      itemId,
      type,
      description,
      performedAt,
      technician,
      nextScheduled: nextScheduled || null,
      createdAt: new Date().toISOString(),
      createdBy: user.name
    }

    db.maintenance.push(newMaintenance)

    // Atualiza o status do item para "Em Operação" após manutenção
    const itemIndex = db.items.findIndex((item: any) => 
      String(item.id) === String(itemId) || item.id === itemId
    )
    if (itemIndex !== -1) {
      db.items[itemIndex].status = ItemStatus.OPERACAO
      db.items[itemIndex].lastMaintenance = performedAt
    }

    writeDb(db)

    return NextResponse.json(newMaintenance, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
