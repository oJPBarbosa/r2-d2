import { Tutoring } from '@prisma/client';

export interface ITutoringsRepository {
  findById(id: string): Promise<Tutoring>;
  findAll(): Promise<Tutoring[]>;
  create(tutoring: Tutoring): Promise<Tutoring>;
  destroy(tutoring: Tutoring): Promise<void>;
}
