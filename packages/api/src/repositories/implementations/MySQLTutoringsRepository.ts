import { ITutoringsRepository } from '../ITutoringsRepository';
import { Tutoring, PrismaClient } from '@prisma/client';

export class MySQLTutoringsRepository implements ITutoringsRepository {
  public async findById(id: string): Promise<Tutoring> {
    const prisma: PrismaClient = new PrismaClient();

    const tutoring: Tutoring = await prisma.tutoring.findFirst({
      where: {
        id,
      },
      include: {
        tutor: true,
        student: true,
      },
    });

    await prisma.$disconnect();

    return tutoring;
  }

  public async findAll(): Promise<Tutoring[]> {
    const prisma: PrismaClient = new PrismaClient();

    const tutorings: Tutoring[] = await prisma.tutoring.findMany({
      include: {
        tutor: true,
        student: true,
      },
    });

    await prisma.$disconnect();

    return tutorings;
  }

  public async create(tutoring: Tutoring): Promise<Tutoring> {
    const prisma: PrismaClient = new PrismaClient();

    const t: Tutoring = await prisma.tutoring.create({
      data: tutoring,
    });

    await prisma.$disconnect();

    return t;
  }

  public async destroy(tutoring: Tutoring): Promise<void> {
    const prisma: PrismaClient = new PrismaClient();

    await prisma.tutoring.delete({
      where: {
        id: tutoring.id,
      },
    });

    await prisma.$disconnect();
  }
}
