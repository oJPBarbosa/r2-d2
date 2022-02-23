import { Tutor } from '@prisma/client';

export interface ITutorsRepository {
  findById(id: string): Promise<Tutor>;
  findOrCreate(tutor: Tutor): Promise<Tutor>;
  findAll(): Promise<Tutor[]>;
  create(tutor: Tutor): Promise<void>;
  destroy(tutor: Tutor): Promise<void>;
}
