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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await params
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = readDb()
    const itemHistory = db.maintenance
      .filter((m: any) => m.itemId === itemId)
      .sort((a: any, b: any) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())

    const item = db.items.find((item: any) => item.id === itemId)
    const historyWithItemName = itemHistory.map((m: any) => ({
      ...m,
      itemName: item?.nome || 'Item não encontrado'
    }))

    return NextResponse.json(historyWithItemName)
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
