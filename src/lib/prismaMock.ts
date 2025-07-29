import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'

import { vi } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}))

export const prismaMock = mockDeep<PrismaClient>()


beforeEach(() => {
  mockReset(prismaMock)
})
