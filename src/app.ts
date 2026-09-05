import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fp from 'fastify-plugin'
import AutoLoad from '@fastify/autoload'
import glue from 'fastify-openapi-glue'
import serviceHandlers from './routes/handlers.ts'
import securityHandlers from './security.ts'

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
    ignorePattern: /^api\/(users|courses|lessons)\.ts$/,
  })

  fastify.register(glue, {
    prefix: 'api',
    specification: path.join(__dirname, '..', 'tsp-output/@typespec/openapi3/openapi.json'),
    serviceHandlers,
    securityHandlers,
  })
})
