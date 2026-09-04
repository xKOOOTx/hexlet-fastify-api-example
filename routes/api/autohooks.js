import fastify from "fastify";

export default function async (fastify, options) {
    fastify.addHook('onRequest', fastify.authenticate)
}