import { Router, Request, Response } from 'express';

import { createTutoringController } from './usecases/Tutoring/CreateTutoring';

const router: Router = Router();

router.post('/tutorings', (request: Request, response: Response) => {
  createTutoringController.handle(request, response);
});

export default router;
