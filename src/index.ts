import fastifyJwt from "@fastify/jwt";
import Fastify from "fastify";
import prismaPlugin from "./plugins/prisma.plugin";
import { adminRoutes } from "./routes/admin.routes";
import { loginRoute } from "./routes/login.route";

const fastify = Fastify()

fastify
    .register(fastifyJwt, { secret: process.env.JWT_SECRET || 'super-secret' })
    .register(prismaPlugin)
    .register(loginRoute)
    .register(adminRoutes)

async function main() {
    try {
        await fastify.listen({ port: 3000 })
    } catch (e) {
        fastify.log.error(e)
        process.exit(1)
    }
}
main()
