import express from 'express';
import { router, publicProcedure, context } from './trpc'
import { inferAsyncReturnType } from '@trpc/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors'

const prisma = new PrismaClient()
const app = express();
const PORT = 3000;



// app.get('/', (req, res) => {
// 	res.send('Hello World with TypeScript and Hot Reload! edited');
// });



const appRouter = router({
	userList: publicProcedure
		.query(async () => {
			const users = await prisma.user.findMany()
			return users
		}),
	userById: publicProcedure
		.input(z.string())
		.query(async (opts) => {
			const { input } = opts
			const user = await prisma.user.findFirst({
				where: {
					publicId: input
				}
			})
			return user
		}),
	userCreate: publicProcedure
		.input(z.object({ publicId: z.string(), email: z.string(), password: z.string() }))
		.mutation(async (opts) => {
			const { input } = opts

			const user = await prisma.user.create({
				data: input
			})

			return user
		})
})

app.use(cors())

app.use(
	'/trpc',
	cors({ origin: 'http://localhost:5173' }),
	trpcExpress.createExpressMiddleware({
		router: appRouter,
		createContext: context,
	}),
);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});


export type AppRouter = typeof appRouter;