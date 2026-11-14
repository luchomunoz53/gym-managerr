import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const coachPassword = await bcrypt.hash('coach123', 10);

  // 1. Super Administrador inicial
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gym.com' },
    update: {},
    create: {
      email: 'admin@gym.com',
      passwordHash: adminPassword,
      name: 'Administrador General',
      role: Role.SUPER_ADMIN,
      commissionRate: 0.0,
      phone: '3001234567',
    },
  });

  // 2. Entrenador de prueba
  const coach = await prisma.user.upsert({
    where: { email: 'carlos@gym.com' },
    update: {},
    create: {
      email: 'carlos@gym.com',
      passwordHash: coachPassword,
      name: 'Carlos Entrenador',
      role: Role.COACH,
      commissionRate: 0.25, // 25% comisión
      phone: '3109876543',
    },
  });

  // 3. Banco de Ejercicios Reales
  const exercises = [
    { name: 'Sentadilla Libre con Barra', muscleGroup: 'Pierna', notes: 'Bajar rompiendo paralelo, torso firme y rodillas alineadas.' },
    { name: 'Prensa Inclinada 45°', muscleGroup: 'Pierna', notes: 'Recorrido profundo sin despegar la zona lumbar del respaldo.' },
    { name: 'Peso Muerto Rumano', muscleGroup: 'Isquios/Glúteo', notes: 'Empujar cadera hacia atrás con ligera flexión de rodilla.' },
    { name: 'Hip Thrust con Barra', muscleGroup: 'Glúteo', notes: 'Bloqueo pélvico arriba 1 segundo con barbilla pegada al pecho.' },
    { name: 'Press de Banca Plano', muscleGroup: 'Pecho', notes: 'Retracción escapular, barra hacia la línea baja del pecho.' },
    { name: 'Press Inclinado con Mancuernas', muscleGroup: 'Pecho', notes: 'Banco a 30°, apertura de codos controlada.' },
    { name: 'Jalón al Pecho Agarre Neutro', muscleGroup: 'Espalda', notes: 'Llevar los codos hacia las costillas sin balanceo.' },
    { name: 'Remo con Barra 45°', muscleGroup: 'Espalda', notes: 'Espalda neutra, halón directo hacia el ombligo.' },
    { name: 'Press Militar con Mancuernas', muscleGroup: 'Hombro', notes: 'Subida vertical sin arquear la zona lumbar.' },
    { name: 'Elevaciones Laterales', muscleGroup: 'Hombro', notes: 'Plano escapular, levantar desde los codos.' },
    { name: 'Curl de Bíceps en Banco Scott', muscleGroup: 'Bíceps', notes: 'Aislamiento completo, extensión controlada.' },
    { name: 'Extensión de Tríceps en Polea', muscleGroup: 'Tríceps', notes: 'Codos fijos a los lados del torso.' },
  ];

  for (const ex of exercises) {
    await prisma.exercise.upsert({
      where: { name: ex.name },
      update: {},
      create: ex,
    });
  }

  // 4. Clientes de prueba para el entrenador
  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setDate(now.getDate() + 30);

  const pastDue = new Date();
  pastDue.setDate(now.getDate() - 3);

  const client1 = await prisma.client.create({
    data: {
      name: 'Alejandro Morales',
      email: 'alejandro@cliente.com',
      phone: '3150001122',
      membershipPlan: 'Plan Hipertrofia Personalizado',
      membershipExpiry: nextMonth,
      coachId: coach.id,
      payments: {
        create: {
          amount: 150000,
          nextDueDate: nextMonth,
          paymentMethod: 'Transferencia Bancaria',
          reference: 'REC-INI-001',
        },
      },
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: 'Mariana Gómez',
      email: 'mariana@cliente.com',
      phone: '3203334455',
      membershipPlan: 'Plan Tonificación',
      membershipExpiry: pastDue,
      coachId: coach.id,
      payments: {
        create: {
          amount: 120000,
          nextDueDate: pastDue,
          paymentMethod: 'Efectivo',
          reference: 'REC-INI-002',
        },
      },
    },
  });

  console.log('Seed ejecutado con éxito: Admin, Entrenador, Clientes y Ejercicios creados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });