import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

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

    return response.status(200).json({ message: 'Rotina de treino criada com sucesso' });
}

export async function concludeWorkout(request: Request, response: Response) {
    const inputData = request.body as Workout;

    if (!inputData.id || !inputData.tempo_total) {
        throw new Error('Dados inválidos, os campos id e tempo_total são obrigatórios');
    }

    const { tempo_total } = inputData;

    await prisma.treinos.update({
        where: {
            id: Number(inputData.id)
        },
        data: {
            data_conclusao: new Date(),
            concluido: true,
            tempo_total
        }
    });

    return response.status(200).json({ message: 'Exercício concluído com sucesso' });
}

export async function getWorkoutRoutineByCategory(request: Request, response: Response) {
    const { usuario_id, categoria } = request.params;

    await validateInputData({ usuario_id, categoria });

    const workoutRoutine = await prisma.treinos.findMany({
        where: {
            usuario_id,
            categoria
        },
        orderBy: [
            {
                semana: 'asc'
            },
            {
                dia_semana: 'asc'
            }
        ]
    });

    return response.status(200).json(workoutRoutine);
}

export async function getWorkoutStats(request: Request, response: Response) {
    const { usuario_id, categoria } = request.params;

    await validateInputData({ usuario_id, categoria });

    const workoutStats = await prisma.treinos.findMany({
        where: {
            usuario_id,
            categoria,
            concluido: true
        },
        select: {
            tempo_total: true,
            categoria: true,
            data_conclusao: true,
            repeticoes: true
        },
        orderBy: {
            data_conclusao: 'desc'
        }
    });

    const parsedData = workoutStats.map(workout => {
        const { tempo_total, data_conclusao, repeticoes } = workout;

        const totalReps = repeticoes.reduce((acc, curr) => acc + curr, 0);

        return {
            ...workout,
            date: data_conclusao?.toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
            reps: totalReps,
            time: secondsToTime(tempo_total ?? 0)
        }
    });

    return response.status(200).json(parsedData);
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

const secondsToTime = (seconds: number) => {
    const miliseconds = seconds * 1000;
    const date = new Date(miliseconds);

    const minutes = date.getUTCMinutes();
    const remainingSeconds = date.getUTCSeconds();

    return `${minutes}:${remainingSeconds}`;
}

type Workout = {
    id: number,
    tempo_total: number,
};

type InputData = {
    categoria: string;
    usuario_id: string;
    repeticoesIniciais: number;
};
