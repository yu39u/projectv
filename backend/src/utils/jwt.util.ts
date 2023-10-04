import { IncomingMessage } from 'http';
import jwt, { Secret } from 'jsonwebtoken';
import { User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export const getUserFromHeader = async (
	headers: IncomingMessage['headers']
) => {
	const authHeader = headers.authorization;

	if (authHeader) {
		try {
			const user = await verifyJWTToken(authHeader.split(' ')[1]);
			return user;
		} catch (err) {
			return null;
		}
	}
	return null;
};

export const verifyJWTToken = async (token: string) => {
	const secret: Secret | undefined = process.env.JWT_SECRET;

	if (!secret) {
		throw new Error('JWT_SECRET is not defined');
	}

	try {
		const data = jwt.verify(token, secret) as { username: string }
		const user = await prisma.user.findFirst({
			where: {
				publicId: data.username,
			},
		});
		return user;
	} catch (err) {
		throw new Error('Invalid token');
	}
};

export const createSession = async (user: User) => {
	const secret: Secret | undefined = process.env.JWT_SECRET;

	if (!secret) {
		throw new Error('JWT_SECRET is not defined');
	}

	const token: string = jwt.sign(
		{ username: user.publicId },
		secret,
		{
			expiresIn: '15d',
		}
	);

	return token;
};