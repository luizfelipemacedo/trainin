import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function deleteUserById(request: Request, response: Response) {
    const { id } = request.params;

    const user = await prisma.users.findUnique({
        where: { id },
    });

    console.log(user);

    if (!user) {
        return response.status(404).json({ message: `Usuário não encontrado!` });
    }

    await prisma.users.delete({
        where: { id },
    });

    return response.status(204).json({ message: `Deletando usuário com id ${id}` });
}