import { Student as StudentModel } from '@prisma/client';
import { Tutoring } from './Tutoring';

export class Student implements StudentModel {
  id: string;

  name: string;

  enrollment_number: string;

  created_at: Date;

  updated_at: Date;

  tutorings: Tutoring[];

  constructor(props: Omit<Student, 'created_at' | 'updated_at' | 'tutorings'>) {
    Object.assign(this, props);
  }
}
