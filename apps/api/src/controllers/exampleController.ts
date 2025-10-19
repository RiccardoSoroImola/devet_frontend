import { Request, Response } from 'express';
import { exampleService } from '../services/exampleService';

export const exampleController = {
  getExample: async (_req: Request, res: Response): Promise<void> => {
    try {
      const data = await exampleService.getExampleData();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  createExample: async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      const result = await exampleService.createExampleData(data);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
