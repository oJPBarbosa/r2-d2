import { ITutorsRepository } from '../../../repositories/ITutorsRepository';
import { MySQLTutorsRepository } from '../../../repositories/implementations/MySQLTutorsRepository';
import { IStudentsRepository } from '../../../repositories/IStudentsRepository';
import { MySQLStudentsRepository } from '../../../repositories/implementations/MySQLStudentsRepository';
import { ITutoringsRepository } from '../../../repositories/ITutoringsRepository';
import { MySQLTutoringsRepository } from '../../../repositories/implementations/MySQLTutoringsRepository';
import { CreateTutoringUseCase } from './CreateTutoringUseCase';
import { CreateTutoringController } from './CreateTutoringController';

const tutorsRepository: ITutorsRepository = new MySQLTutorsRepository();
const studentsRepository: IStudentsRepository = new MySQLStudentsRepository();
const tutoringsRepository: ITutoringsRepository =
  new MySQLTutoringsRepository();

const createTutoringUseCase: CreateTutoringUseCase = new CreateTutoringUseCase(
  tutorsRepository,
  studentsRepository,
  tutoringsRepository,
);

const createTutoringController: CreateTutoringController =
  new CreateTutoringController(createTutoringUseCase);

export { createTutoringController };
