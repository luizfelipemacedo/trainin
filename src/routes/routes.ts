import { Router } from "express";
import { getHelloWorld } from "../controllers/hello";

const routes = Router();

routes.get('/', getHelloWorld);

export default routes;