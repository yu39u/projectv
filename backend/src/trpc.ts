import trpc, { initTRPC, inferAsyncReturnType } from "@trpc/server"
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { getUserFromHeader } from './utils/jwt.util';

const createContext = async ({ req, res }: CreateExpressContextOptions) => {
	// トークンをデコードしてコンテキストに追加します。
	// 実際のアプリケーションでは、エラーハンドリングを追加し、
	// トークンが無効な場合に適切に対応する必要があります。
	const user = await getUserFromHeader(req.headers);

	return {
		headers: req.headers,
		user: user,
		req,
		res,
	};
};

type Context = inferAsyncReturnType<typeof createContext>;

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create();

export const protectedRoute = t.middleware(async ({ ctx, next }) => {
	const user = await getUserFromHeader(ctx.headers);
	if (!user) {
		console.log(`Unauthenticated while accesing ${ctx.req.url}`, ctx.headers);
		throw new Error(`Unauthenticated when trying to access ${ctx.req.url}`);
	}
	ctx.user = user;

	return next();
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(protectedRoute);
export const context = createContext