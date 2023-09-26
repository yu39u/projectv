import express from 'express';
import { router, publicProcedure, context } from './trpc'
import { inferAsyncReturnType } from '@trpc/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod';
import * as trpcExpress from '@trpc/server/adapters/express';


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
			// const users = [{ user: 1 }]
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
		})
})

app.use(
	'/trpc',
	trpcExpress.createExpressMiddleware({
		router: appRouter,
		createContext: context,
	}),
);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});


export type AppRouter = typeof appRouter;