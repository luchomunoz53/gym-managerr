import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Banco de ejercicios o rutinas de un cliente en específico
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    const exercises = await prisma.exercise.findMany({
      orderBy: { muscleGroup: 'asc' },
    });

    if (clientId) {
      const clientRoutines = await prisma.routine.findMany({
        where: { clientId },
        include: {
          items: {
            include: { exercise: true },
            orderBy: { orderIndex: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ exercises, clientRoutines });
    }

    return NextResponse.json({ exercises, clientRoutines: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar rutinas' }, { status: 500 });
  }
}

// POST: Crear una rutina asignada a un cliente
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, dayOfWeek, clientId, coachId, items } = body;

    if (!name || !dayOfWeek || !clientId || !coachId || !items?.length) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const routine = await prisma.routine.create({
      data: {
        name,
        dayOfWeek,
        clientId,
        coachId,
        items: {
          create: items.map((item: any, index: number) => ({
            exerciseId: item.exerciseId,
            sets: parseInt(item.sets, 10),
            reps: String(item.reps),
            restSec: parseInt(item.restSec, 10),
            rpe: item.rpe ? parseInt(item.rpe, 10) : null,
            orderIndex: index,
          })),
        },
      },
      include: {
        items: { include: { exercise: true } },
      },
    });

    return NextResponse.json(routine, { status: 201 });
  } catch (error) {
    console.error('Error al guardar rutina:', error);
    return NextResponse.json({ error: 'Error al guardar rutina' }, { status: 500 });
  }
}

// DELETE: Eliminar una rutina por ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const routineId = searchParams.get('id');

    if (!routineId) {
      return NextResponse.json({ error: 'ID de rutina requerido' }, { status: 400 });
    }

    // Eliminamos los items asociados y la rutina en cascada
    await prisma.routineItem.deleteMany({
      where: { routineId },
    });

    await prisma.routine.delete({
      where: { id: routineId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar rutina' }, { status: 500 });
  }
}