import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();
function clamp(num : number, min: number, max: number) : number { return Math.min(Math.max(num, min), max);}

export async function createRoutine(request: Request, response: Response) {
    const inputData = request.body as InputData;
    const parsedCategoryName = parseCategoryName(inputData.categoria);

    await validateInputData({ ...inputData, categoria: parsedCategoryName });

    const { usuario_id, repeticoesIniciais: inicialReps } = inputData;

    if (!inicialReps) throw new Error('Dados inválidos, o campo repeticoesIniciais é obrigatório')

    const weeks = 4;
    const daysPerWeek = 3;

    const routineDays = generateRoutineDays(weeks, daysPerWeek);

    const levelingReps = clamp(inicialReps, 1, 80);
    const levelingFactor = await getExerciceLevelingFactor(parsedCategoryName);
    const dailyIncrements = [0.41, 0.52, 0.41, 0.36, 0.56];

    const workoutRoutine = routineDays.map((routineDay, index) => {
        //const dailyIncrement = dailyIncrements[index % dailyIncrements.length];
        const repeticoes = calculateRepetitions(levelingReps, levelingFactor, dailyIncrements, index);

        const { dia: dia_semana, semana } = routineDay;

        return {
            categoria: parsedCategoryName,
            dia_semana,
            usuario_id,
            repeticoes,
            semana
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

export async function deleteWorkout(request: Request, response: Response) {
    const { usuario_id, categoria } = request.params;

    const parsedCategoryName = parseCategoryName(categoria);
    await validateInputData({ usuario_id, categoria: parsedCategoryName });    

    await prisma.treinos.deleteMany({
        where: {
            usuario_id: usuario_id,
            categoria: parsedCategoryName
        }
    });    

    return response.status(200)
        .json({ message: `Rotina de treinos de ${parsedCategoryName} apagados com sucesso!` });
}

export async function getWorkoutRoutineByCategory(request: Request, response: Response) {
    const { usuario_id, categoria } = request.params;

    const parsedCategoryName = parseCategoryName(categoria);
    await validateInputData({ usuario_id, categoria: parsedCategoryName });

    const workoutRoutine = await prisma.treinos.findMany({
        where: {
            categoria: parsedCategoryName,
            usuario_id
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

    const parsedCategoryName = parseCategoryName(categoria);
    await validateInputData({ usuario_id, categoria: parsedCategoryName });

    const workoutStats = await prisma.treinos.findMany({
        where: {
            categoria: parsedCategoryName,
            concluido: true,
            usuario_id
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
            time: milisecondsToTime(tempo_total ?? 0)
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

const generateRoutineDays = (weeks: number, daysPerWeek: number) => {
    const totalDays = weeks * daysPerWeek;

    const routineDays = Array.from({ length: totalDays })
        .map((_, index) => ({
            semana: Math.floor(index / daysPerWeek) + 1,
            dia: index % daysPerWeek + 1
        }));

    return routineDays;
}

const calculateRepetitions = (inicialReps: number, levelingFactor: number, dailyIncrements: number[], index: number) => {
    return Array.from({ length: 5 })
    .map((_, index) => clamp(Math.round(inicialReps * dailyIncrements[index] * Math.pow(levelingFactor, index)), 1, 100))
    .map(repeticao => repeticao + index);
}

const milisecondsToTime = (miliseconds: number) => {
    const date = new Date(miliseconds);

    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const remainingSeconds = String(date.getSeconds()).padStart(2, '0');

    return `${minutes}:${remainingSeconds}`;
}

const parseCategoryName = (category: string) => {
    const categorys = {
        flexao: 'FLEXÃO',
        abdominal: 'ABDOMINAL',
        agachamento: 'AGACHAMENTO',
        triceps: 'TRÍCEPS',
    };

    const parsedCategoryName = categorys[category as keyof typeof categorys];

    return parsedCategoryName;
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
