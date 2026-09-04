import path from 'node:path'
import AutoLoad from '@fastify/autoload'
import { fileURLToPath } from 'node:url'
import fp from 'fastify-plugin'
import { TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox'

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
  const api = fastify
    .setValidatorCompiler(TypeBoxValidatorCompiler)
    .withTypeProvider()

  api.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  api.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts),
    autoHooks: true,
    cascadeHooks: true
  })
})
