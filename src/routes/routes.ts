import { Router } from "express";
import { deleteUserById } from "../controllers/user";
import { concludeWorkout, createRoutine, deleteWorkout, getWorkoutRoutineByCategory, getWorkoutStats } from "../controllers/workout";

const routes = Router();

//user routes
routes.delete('/user/:id', deleteUserById);

//workout routes
routes.get('/workout/:usuario_id/:categoria', getWorkoutRoutineByCategory);
routes.get('/workout/stats/:usuario_id/:categoria', getWorkoutStats);
routes.post('/workout/conclude', concludeWorkout);
routes.post('/workout/create-routine', createRoutine);
routes.delete('/workout/delete/:usuario_id/:categoria', deleteWorkout);

export default routes;