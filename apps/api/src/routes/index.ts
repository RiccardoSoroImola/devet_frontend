import { Router, IRouter } from 'express';
import { exampleController } from '../controllers/exampleController';

export const router: IRouter = Router();

// Example routes
router.get('/example', exampleController.getExample);
router.post('/example', exampleController.createExample);

// Add more routes here as needed
