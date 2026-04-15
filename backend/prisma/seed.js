import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'serena' }, // User used 'serena' as email in demo logic
    update: {},
    create: {
      email: 'serena',
      password: hashedPassword,
      name: 'Serena Glow Admin',
      role: 'admin'
    }
  });

  console.log('✅ Admin user created/verified:', admin.email);

  // Optional: Seed some initial services
  const facialCat = "Facial";
  
  const services = [
    { name_pt: 'Limpeza de Pele Profunda', name_en: 'Deep Facial Cleaning', price: 2500, category: facialCat },
    { name_pt: 'Manicure Gel', name_en: 'Gel Manicure', price: 1200, category: 'Unhas' },
    { name_pt: 'Massagem Relaxante', name_en: 'Relaxing Massage', price: 3000, category: 'Corpo' }
  ];

  for (const s of services) {
    await prisma.service.create({ data: s });
  }
  
  console.log('✅ Initial services seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
