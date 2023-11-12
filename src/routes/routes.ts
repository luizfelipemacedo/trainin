import { Router } from "express";
import { deleteUserById } from "../controllers/user";
import { createRoutine } from "../controllers/workout";

const routes = Router();

//user routes
routes.delete('/user/:id', deleteUserById);

//workout routes
routes.post('/workout/create-routine', createRoutine);

export default routes;