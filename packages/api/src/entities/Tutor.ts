import { Tutor as TutorModel } from '@prisma/client';
import { Tutoring } from './Tutoring';
import { Department } from './Department';

export class Tutor implements TutorModel {
  id: string;

  name: string;

  department_id: string;

  created_at: Date;

  updated_at: Date;

  tutorings: Tutoring[];

  department: Department;

  constructor(
    props: Omit<
      Tutor,
      'created_at' | 'updated_at' | 'tutorings' | 'department'
    >,
  ) {
    Object.assign(this, props);
  }
}
