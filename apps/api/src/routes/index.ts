import { Router } from 'express';
import { exampleController } from '../controllers/exampleController';

export const router = Router();

// Example routes
router.get('/example', exampleController.getExample);
router.post('/example', exampleController.createExample);

// Add more routes here as needed
