import { IStudentsRepository } from '../IStudentsRepository';
import { Student, PrismaClient } from '@prisma/client';

export class MySQLStudentsRepository implements IStudentsRepository {
  public async findById(id: string): Promise<Student> {
    const prisma: PrismaClient = new PrismaClient();

    const student: Student = await prisma.student.findFirst({
      where: {
        id,
      },
    });

    await prisma.$disconnect();

    return student;
  }

  public async findOrCreate(student: Student): Promise<Student> {
    const prisma: PrismaClient = new PrismaClient();

    const s: Student =
      (await prisma.student.findUnique({ where: { id: student.id } })) ??
      (await prisma.student.create({
        data: student,
      }));

    await prisma.$disconnect();

    return s;
  }

  public async findAll(): Promise<Student[]> {
    const prisma: PrismaClient = new PrismaClient();

    const students: Student[] = await prisma.student.findMany();

    await prisma.$disconnect();

    return students;
  }

  public async create(student: Student): Promise<void> {
    const prisma: PrismaClient = new PrismaClient();

    await prisma.student.create({
      data: student,
    });

    await prisma.$disconnect();
  }

  public async destroy(student: Student): Promise<void> {
    const prisma: PrismaClient = new PrismaClient();

    await prisma.student.delete({
      where: {
        id: student.id,
      },
    });

    await prisma.$disconnect();
  }
}
