import { CreateTutoringUseCase } from './CreateTutoringUseCase';
import { Request, Response } from 'express';
import { Tutoring } from '../../../entities/Tutoring';

export class CreateTutoringController {
  constructor(private createTutoringUseCase: CreateTutoringUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { at, tutor_id, student, department_id } = request.body;

    try {
      const tutoring: Tutoring = await this.createTutoringUseCase.execute({
        at,
        tutor_id,
        student,
        department_id,
      });

      return response.json({
        id: tutoring.id,
      });
    } catch (err) {
      return response
        .status(err.hasOwnProperty('status') ? err.status : 500)
        .json({
          error: err.hasOwnProperty('message')
            ? err.message
            : 'Unexpected error.',
        });
    }
  }
}
