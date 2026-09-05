import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fp from 'fastify-plugin'
import AutoLoad from '@fastify/autoload'
import glue from 'fastify-openapi-glue'
import serviceHandlers from './routes/handlers.ts'
import securityHandlers from './security.ts'
import * as z from 'zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Pass --options via CLI arguments in command to enable these options.
export const options = {}

export default fp(async function (fastify, opts) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts),
    ignorePattern: /^api\/(users|courses|lessons|tokens)\.ts$/,
  })

  fastify.register(glue, {
    prefix: 'api',
    specification: path.join(__dirname, '..', 'tsp-output/@typespec/openapi3/openapi.json'),
    serviceHandlers,
    securityHandlers,
  })

  fastify.setErrorHandler((error, _request, reply) => {
    if (error instanceof z.ZodError) {
      const errorDetail = {
        status: 422,
        title: 'Validation Error',
        detail: 'Errors related to business logic such as uniqueness',
        errors: error.issues.map((issue) => ({
          field: issue.path.map(String).join('.'),
          rule: issue.code,
          message: issue.message
        }))
      }

      return reply.code(422).send(errorDetail)
    }

    return reply.send(error)
  })
})
