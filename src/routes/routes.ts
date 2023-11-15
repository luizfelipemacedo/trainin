import { Router } from "express";
import { deleteUserById } from "../controllers/user";
import { concludeWorkout, createRoutine, getWorkoutRoutineByCategory } from "../controllers/workout";

const routes = Router();

//user routes
routes.delete('/user/:id', deleteUserById);

//workout routes
routes.post('/workout/create-routine', createRoutine);
routes.post('/workout/conclude', concludeWorkout);
routes.get('/workout/:usuario_id/:categoria', getWorkoutRoutineByCategory);

export default routes;