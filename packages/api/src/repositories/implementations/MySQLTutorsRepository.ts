import { ITutorsRepository } from '../ITutorsRepository';
import { Tutor, Department, PrismaClient } from '@prisma/client';

export class MySQLTutorsRepository implements ITutorsRepository {
  public async findById(id: string): Promise<Tutor> {
    const prisma: PrismaClient = new PrismaClient();

    const tutor: Tutor = await prisma.tutor.findFirst({
      where: {
        id,
      },
      include: {
        department: true,
      },
    });

    await prisma.$disconnect();

    return tutor;
  }

  public async findOrCreate(tutor: Tutor): Promise<Tutor> {
    const prisma: PrismaClient = new PrismaClient();

    const t: Tutor =
      (await prisma.tutor.findUnique({ where: { id: tutor.id } })) ??
      (await prisma.tutor.create({
        data: tutor,
      }));

    await prisma.$disconnect();

    return t;
  }

  public async findAll(): Promise<Tutor[]> {
    const prisma: PrismaClient = new PrismaClient();

    const tutors: Tutor[] = await prisma.tutor.findMany();

    await prisma.$disconnect();

    return tutors;
  }

  public async create(tutor: Tutor): Promise<void> {
    const prisma: PrismaClient = new PrismaClient();

    await prisma.tutor.create({
      data: tutor,
      include: {
        department: true,
      },
    });

    await prisma.$disconnect();
  }

  public async destroy(tutor: Tutor): Promise<void> {
    const prisma: PrismaClient = new PrismaClient();

    await prisma.tutor.delete({
      where: {
        id: tutor.id,
      },
    });

    await prisma.$disconnect();
  }
}
