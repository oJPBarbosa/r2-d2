import { Tutoring as TutoringModel } from '@prisma/client';
import { AtT } from '../interfaces/At';
import { Tutor } from './Tutor';
import { Student } from './Student';
import { Department } from './Department';
import { v4 } from 'uuid';

export class Tutoring implements TutoringModel {
  id: string;

  at: AtT;

  tutor_id: string;

  student_id: string;

  department_id: string;

  created_at: Date;

  updated_at: Date;

  tutor: Tutor;

  student: Student;

  department: Department;

  constructor(
    props: Omit<
      Tutoring,
      'id' | 'created_at' | 'updated_at' | 'tutor' | 'student' | 'department'
    >,
  ) {
    Object.assign(this, props);
    this.id = v4();
  }
}
