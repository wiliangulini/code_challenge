export enum ItemStatus {
  OPERACAO = 'Em Operação',
  INATIVO = 'Inativo',
  MANUTENCAO = 'Em Manutenção',
}

export interface Item {
  id: string
  nome: string
  descricao: string
  localizacao: string
  status: ItemStatus
}