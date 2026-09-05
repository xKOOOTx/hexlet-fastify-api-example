import { httpErrors } from '@fastify/sensible'
import type { RouteHandlers } from '../types/handlers/fastify.gen.ts'

export function defineHandlers<T extends Partial<RouteHandlers>>(handlers: T) {
  return handlers
}

export function ensure<T>(
  value: T | null | undefined,
  status = 404,
): asserts value is NonNullable<T> {
  if (value == null) {
    throw httpErrors.createError(status)
  }
}

export const getPagingOptions = (page: number, perPage: number) => ({
  limit: perPage,
  offset: (page - 1) * perPage,
})

export function serializeTimestamps<T extends { createdAt: Date; updatedAt: Date }> (
  record: T,
): Omit<T, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string } {
  return {
    ...record,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString()
  }
}