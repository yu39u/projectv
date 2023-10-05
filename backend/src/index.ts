import express, { json, Request, Response, NextFunction } from 'express';
import { router, publicProcedure, context, protectedProcedure } from './trpc'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors'
import { crypt, compare } from './crypt';
import 'dotenv/config'
import { createSession } from './utils/jwt.util';
import { TRPCError } from '@trpc/server';

const prisma = new PrismaClient()
const app = express();
const PORT = 3000;

app.use(json());

app.use((req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(' ')[1];
		(req as any)['token'] = token;
	}
	next();
});

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
				data: {
					publicId: input.publicId,
					email: input.email,
					password: crypt(input.password)
				}
			})

			return user
		}),
	signin: publicProcedure
		.input(z.object({ username: z.string(), password: z.string() }))
		.mutation(async ({ input }) => {
			const user = await prisma.user.findUnique({
				where: {
					publicId: input.username,
				},
			});
			if (!user) throw new Error('Invalid credentials');

			const doPasswordsMatch = compare(input.password, user.password);
			if (!doPasswordsMatch) throw new Error('Invalid credentials');

			const token = await createSession(user);

			return { token };

		}),
	signup: publicProcedure
		.input(z.object({ email: z.string(), username: z.string(), password: z.string() }))
		.mutation(async ({ input }) => {
			const { email, username, password } = input

			const hashedPassword = crypt(password);

			const existingEmail = await prisma.user.findUnique({
				where: {
					email,
				},
			});

			if (existingEmail) {
				throw new TRPCError({
					message: 'The email is already in use',
					code: 'BAD_REQUEST',
				});
			}

			const user = await prisma.user.create({
				data: {
					publicId: username,
					email,
					password: hashedPassword
				},
			});

			const token = await createSession(user);

			return { token };
		}),
	protected: protectedProcedure
		.query(({ ctx }) => {
			return ctx.user
		}),

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