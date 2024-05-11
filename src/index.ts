import { PrismaClient } from "@prisma/client";
import Fastify from "fastify";
import phonebookRoute from "./routes/phonebook.route";
import userRoute from './routes/user.route'
import prismaPlugin from "./plugins/prisma.plugin";

const fastify = Fastify({
    logger: true,
})

fastify.register(prismaPlugin)
fastify.register(phonebookRoute, { prefix: '/phonebook' })
fastify.register(userRoute, { prefix: '/user' })
async function main() {
    try {
        await fastify.listen({ port: 3000 })
    } catch (e) {
        fastify.log.error(e)
        process.exit(1)
    }
}
main()
