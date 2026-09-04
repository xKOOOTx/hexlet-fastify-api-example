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