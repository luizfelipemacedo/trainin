import 'dotenv/config'
import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

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