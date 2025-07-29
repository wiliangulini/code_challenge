import { itemSchema } from '@/lib/validators/itemSchema'

describe('itemSchema', () => {
  it('deve validar item corretamente', () => {
    const valid = itemSchema.safeParse({
      nome: 'Impressora',
      descricao: 'Laser HP',
      localizacao: 'Sala 1',
      status: 'Em Operação'
    })
    expect(valid.success).toBe(true)
  })

  it('deve rejeitar item com campos vazios', () => {
    const invalid = itemSchema.safeParse({
      nome: '', descricao: '', localizacao: '', status: 'Desconhecido'
    })
    expect(invalid.success).toBe(false)
  })
})