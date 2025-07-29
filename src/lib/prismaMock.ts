import { PrismaClient } from '@prisma/client'

jest.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}))

const createMockMethod = () => jest.fn()

export const prismaMock = {
  maintenance: {
    create: createMockMethod(),
    findMany: createMockMethod(),
    findFirst: createMockMethod(),
    update: createMockMethod(),
    delete: createMockMethod(),
  },
  item: {
    create: createMockMethod(),
    findMany: createMockMethod(),
    findFirst: createMockMethod(),
    update: createMockMethod(),
    delete: createMockMethod(),
  },
  user: {
    create: createMockMethod(),
    findMany: createMockMethod(),
    findFirst: createMockMethod(),
    update: createMockMethod(),
    delete: createMockMethod(),
  },
} as unknown as jest.Mocked<PrismaClient>
