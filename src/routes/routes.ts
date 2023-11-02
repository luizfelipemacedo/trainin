import { Router } from "express";
import { deleteUserById } from "../controllers/user";

const routes = Router();

routes.delete('/user/:id', deleteUserById);

export default routes;