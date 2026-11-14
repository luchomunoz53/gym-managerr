import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Listar todos los ejercicios ordenados por grupo muscular
export async function GET() {
  try {
    const exercises = await prisma.exercise.findMany({
      orderBy: [{ muscleGroup: 'asc' }, { name: 'asc' }],
    });
    return NextResponse.json(exercises);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener ejercicios' }, { status: 500 });
  }
}

// POST: Crear un nuevo ejercicio biomecánico
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, muscleGroup, notes } = body;

    if (!name || !muscleGroup) {
      return NextResponse.json(
        { error: 'El nombre y el grupo muscular son obligatorios' },
        { status: 400 }
      );
    }

    const newExercise = await prisma.exercise.create({
      data: {
        name: name.trim(),
        muscleGroup: muscleGroup.trim(),
        notes: notes ? notes.trim() : null,
      },
    });

    return NextResponse.json(newExercise, { status: 201 });
  } catch (error) {
    console.error('Error al registrar ejercicio:', error);
    return NextResponse.json({ error: 'Error al guardar ejercicio' }, { status: 500 });
  }
}

// DELETE: Eliminar un ejercicio si no está anclado a rutinas activas
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    // Verificar si se usa en alguna rutina
    const usageCount = await prisma.routineItem.count({
      where: { exerciseId: id },
    });

    if (usageCount > 0) {
      return NextResponse.json(
        { error: `No se puede eliminar: el ejercicio está asignado en ${usageCount} rutina(s).` },
        { status: 400 }
      );
    }

    await prisma.exercise.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar ejercicio' }, { status: 500 });
  }
}