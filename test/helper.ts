// This file contains code that we reuse between our tests.
import Fastify, { type FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { afterAll, beforeAll, test as base } from 'vitest'
import app from '../src/app.ts'
import type { DrizzleDB } from '../src/types/index.ts'

const ROLLBACK = Symbol('rollback')

function deferred<T = void>() {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

async function build(): Promise<FastifyInstance> {
  const fastify = Fastify({
    pluginTimeout: 60_000,
    logger: {
      level: 'error',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    },
  })
  fastify.register(fp(app))
  await fastify.ready()

  return fastify
}

function createTest() {
  let instance: FastifyInstance
  let seeded: DrizzleDB

  beforeAll(async () => {
    instance = await build()
    seeded = instance.db
  })

  afterAll(async () => {
    await instance?.close()
  })

  return base.extend<{ app: FastifyInstance }>({
    app: async ({ task: _task }, use) => {
      const opened = deferred()
      const finished = deferred<never>()

      const transaction = seeded
        .transaction(async (tx) => {
          instance.db = tx as unknown as DrizzleDB
          opened.resolve()
          await finished.promise
        })
        .catch((error) => {
          if (error !== ROLLBACK) {
            throw error
          }
        })
      await opened.promise

      await use(instance)

      finished.reject(ROLLBACK)
      await transaction
      instance.db = seeded
    },
  })
}

function getAuthHeader(app: FastifyInstance) {
  const token = app.jwt.sign({ id: 1 })
  return { authorization: `Bearer ${token}` }
}

export { build, createTest, getAuthHeader }