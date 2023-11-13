import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

type InputData = {
    categoria: string;
    usuario_id: string;
    repeticoesIniciais: number;
}

export async function createRoutine(request: Request, response: Response) {
    const inputData = request.body as InputData;

    await validateInputData(inputData);

    const weeks = 2;
    const daysPerWeek = 3;
    const totalDays = weeks * daysPerWeek;

    const routineDays = Array.from({ length: totalDays })
        .map((_, index) => ({
            semana: Math.floor(index / daysPerWeek) + 1,
            dia: index % daysPerWeek + 1
        }));

    const { categoria, usuario_id, repeticoesIniciais } = inputData;
    
    if (!repeticoesIniciais) throw new Error('Dados inválidos, o campo repeticoesIniciais é obrigatório')

    const fatorNivelamento = await getExerciceLevelingFactor(categoria);

    const workoutRoutine = routineDays.map((routineDay, index) => {
        const incrementoDiario = 1;
        const repeticoes = Array.from({ length: 5 })
            .map((_, index) => Math.round(repeticoesIniciais * Math.pow(fatorNivelamento, index) + incrementoDiario * index));

        return {
            dia_semana: routineDay.dia,
            semana: routineDay.semana,
            categoria,
            usuario_id,
            repeticoes: repeticoes.map(repeticao => repeticao + index)
        };
    });

    await prisma.treinos.createMany({
        data: workoutRoutine,
    });

    return response.json({ message: 'Rotina de treino criada com sucesso' });
}

export async function getWorkoutRoutineByCategory(request: Request, response: Response) {
    const { usuario_id, categoria } = request.params;

    await validateInputData({ usuario_id, categoria });

    const workoutRoutine = await prisma.treinos.findMany({
        where: {
            usuario_id,
            categoria
        }
    });

    return response.json(workoutRoutine);
}

async function getExerciceLevelingFactor(exercice: string): Promise<number> {

    const exerciceLevelingFactor = await prisma.categorias.findUnique({
        where: {
            nome: exercice
        },
        select: {
            fator_nivelamento: true
        }
    });

    if (!exerciceLevelingFactor) {
        throw new Error('Exercício não encontrado');
    }

    return parseFloat(exerciceLevelingFactor.fator_nivelamento);
}

async function validateInputData(inputData: Omit<InputData, 'repeticoesIniciais'>) {
    const { categoria, usuario_id } = inputData;

    if (!categoria || !usuario_id) {
        throw new Error('Dados inválidos, os campos categoria e usuario_id são obrigatórios');
    }

    const categorias = await prisma.categorias.findUnique({
        where: {
            nome: categoria
        },
    });

    if (!categorias) {
        throw new Error('Categoria não encontrada');
    }

    const usuario = await prisma.usuarios.findUnique({
        where: {
            id: usuario_id
        }
    });

    if (!usuario) {
        throw new Error('Usuário não encontrado');
    }
}