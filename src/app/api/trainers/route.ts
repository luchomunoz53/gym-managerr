import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

// GET: Obtener lista de entrenadores con métricas agrupadas
export async function GET() {
  try {
    const trainers = await prisma.user.findMany({
      where: { role: Role.COACH },
      include: {
        clients: {
          include: {
            payments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(trainers);
  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar entrenadores' }, { status: 500 });
  }
}

// POST: Registrar un nuevo entrenador con su propia cuenta
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, commissionRate } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Ya existe una cuenta con este correo' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newTrainer = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone: phone || null,
        role: Role.COACH,
        commissionRate: parseFloat(commissionRate || '0.20'),
      },
    });

    return NextResponse.json(
      { id: newTrainer.id, name: newTrainer.name, email: newTrainer.email },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al registrar entrenador:', error);
    return NextResponse.json({ error: 'Error interno al crear entrenador' }, { status: 500 });
  }
}