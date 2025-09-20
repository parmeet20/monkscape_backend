import { Router } from "express";
import { getUserFromToken, login, register } from "../controllers/userController";
import { authenticateToken } from "../middleware/authMiddleware";

const routes = Router();

routes.post('/register', register);
routes.post('/login', login);
routes.get('/', authenticateToken, getUserFromToken);

export default routes;