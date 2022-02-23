import { Department } from '../src/entities/Department';
import { PrismaClient } from '@prisma/client';

const prisma: PrismaClient = new PrismaClient();

async function main(): Promise<void> {
  const departments: Department[] = [
    new Department({
      id: '692460441678381077',
      name: 'Informática e Desenvolvimento de Sistemas',
    }),
    new Department({
      id: '804419662275805244',
      name: 'Física',
    }),
  ];

  departments.forEach(async (department: Department) => {
    await prisma.department.upsert({
      where: { id: department.id },
      update: {},
      create: department,
    });
  });
}

main()
  .catch((err: Error) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
