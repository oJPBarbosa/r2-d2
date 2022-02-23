import { Student } from '@prisma/client';

export interface IStudentsRepository {
  findById(id: string): Promise<Student>;
  findOrCreate(student: Student): Promise<Student>;
  findAll(): Promise<Student[]>;
  create(student: Student): Promise<void>;
  destroy(student: Student): Promise<void>;
}
