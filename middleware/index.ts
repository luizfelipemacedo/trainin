import 'dotenv/config'
import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { Telegraf } from "telegraf";

const JWT_SECRET = process.env.JWT_SECRET;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string);

export async function authenticateUser(request: Request, response: Response, next: NextFunction) {
  try {
    const authHeader = request.headers["authorization"] as string;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return response.status(401).send({ error: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET as string);
    console.log('token verified');
    return next();

  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError) {
      return response.status(401).send({ message: error.message });
    }

    return response.status(401).send({ message: 'Invalid token' });
  }
}

export async function errorHandler(error: Error, request: Request, response: Response, next: NextFunction) {
  console.error(error);

  if (IS_PRODUCTION) {
    const errorMessage = `
      <b>🚨 ERRO DETECTADO NA APLICAÇÃO</b>

      <b>🌐 IP DO USUÁRIO:</b>
      <pre>
      ${request.ip}
      </pre>

      <b>💾 DADOS DA REQUISIÇÃO:</b>
      <pre>
      ${JSON.stringify(request.body)}
      </pre>

      <b>🔎 DADOS DO ERRO:</b>
      <pre>
      ${error.stack ?? error.message}
      </pre>

      <b>🕤 DATA E HORA:</b>
      <pre>
      ${new Date().toLocaleString('pt-BR')}
      </pre>`;

    bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID as string, errorMessage, { parse_mode: 'HTML' });
  };
  
  if (error instanceof Error) {
    return response.status(400).send({ message: error.message });
  };

  return response.status(500).send({ message: "Erro no servidor" });
}