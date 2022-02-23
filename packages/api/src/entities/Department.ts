import { Department as DepartmentModel } from '@prisma/client';
import { Tutor } from './Tutor';
import { Tutoring } from './Tutoring';

export class Department implements DepartmentModel {
  id: string;

  name: string;

  created_at: Date;

  updated_at: Date;

  tutors: Tutor[];

  tutorings: Tutoring[];

  constructor(
    props: Omit<
      Department,
      'created_at' | 'updated_at' | 'tutors' | 'tutorings'
    >,
  ) {
    Object.assign(this, props);
  }
}
