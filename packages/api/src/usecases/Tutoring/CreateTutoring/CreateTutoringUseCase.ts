import { ITutorsRepository } from '../../../repositories/ITutorsRepository';
import { IStudentsRepository } from '../../../repositories/IStudentsRepository';
import { ITutoringsRepository } from '../../../repositories/ITutoringsRepository';
import { ICreateTutoringRequestDTO } from './CreateTutoringDTO';
import { Tutoring } from '../../../entities/Tutoring';
import { analyzeDTO } from '../../../errors/DTOError';
import { ExecuteError } from '../../../errors/ExecuteError';
import axios, { AxiosResponse } from 'axios';
import { Tutor } from '../../../entities/Tutor';
import { Student } from '../../../entities/Student';

export class CreateTutoringUseCase {
  constructor(
    private tutorsRepository: ITutorsRepository,
    private studentsRepository: IStudentsRepository,
    private tutoringsRepository: ITutoringsRepository,
  ) {}

  async execute(data: ICreateTutoringRequestDTO): Promise<Tutoring> {
    const { at } = data;
    const s: Partial<Student> = data.student;

    try {
      analyzeDTO({ at, student: s });
    } catch (err) {
      throw new ExecuteError({
        message: err.message,
        status: 400,
      });
    }

    const { tutor_id, department_id } = data;

    let response: AxiosResponse = null;

    try {
      response = await axios.get(
        `${process.env.DEPARTMENTS_DATA_URL}/${department_id}.json`,
      );
    } catch (err) {
      throw new ExecuteError({
        message: 'Department not found.',
        status: 404,
      });
    }

    const { tutors }: { tutors: Partial<Tutor>[] } = response.data;

    const tutor_name: string = tutors.find(
      (t: Partial<Tutor>) => t.id === tutor_id,
    )?.name;

    if (!tutor_name) {
      throw new ExecuteError({
        message: 'Tutor not found.',
        status: 404,
      });
    }

    const tutor: Tutor = (await this.tutorsRepository.findOrCreate(
      new Tutor({
        id: tutor_id,
        name: tutor_name,
        department_id,
      }),
    )) as Tutor;

    const student: Student = (await this.studentsRepository.findOrCreate(
      new Student({
        id: s.id,
        name: s.name,
        enrollment_number: s.enrollment_number,
      }),
    )) as Student;

    const tutoring: Tutoring = (await this.tutoringsRepository.create(
      new Tutoring({
        at,
        tutor_id: tutor.id,
        student_id: student.id,
        department_id,
      }),
    )) as Tutoring;

    return tutoring;
  }
}
