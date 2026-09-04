
export default function async (fastify, options) {
    fastify.addHook('onRequest', fastify.authenticate)
}