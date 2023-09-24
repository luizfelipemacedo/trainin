import { Request, Response } from 'express';
import { helloService } from '../../services/hello/hello';

export async function getHelloWorld(request: Request, response: Response) {
    const ip = request.ip;

    const message = helloService.getHelloMessage(ip);

    return response.send(message);
}