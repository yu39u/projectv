import bcrypt from 'bcrypt'

const saltRounds = 10

export const crypt = (plainPassword: string): string => {
	return bcrypt.hashSync(plainPassword, saltRounds);
}

export const compare = (plainPassword: string, hashedPassword: string): boolean => {
	return bcrypt.compareSync(plainPassword, hashedPassword);
}