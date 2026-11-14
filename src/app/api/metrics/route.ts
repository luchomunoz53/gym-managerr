import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Obtener historial de mediciones de un atleta ordenado por fecha
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json({ error: 'clientId es requerido' }, { status: 400 });
    }

    const metrics = await prisma.anthropometricMetric.findMany({
      where: { clientId },
      orderBy: { recordedAt: 'desc' },
    });

    return NextResponse.json(metrics);
  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar mediciones' }, { status: 500 });
  }
}

// POST: Registrar una nueva toma de medidas antropométricas
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientId,
      weightKg,
      bodyFatPercent,
      muscleMassKg,
      chestCm,
      waistCm,
      hipCm,
      armCm,
      thighCm,
      notes,
    } = body;

    if (!clientId || !weightKg) {
      return NextResponse.json(
        { error: 'clientId y peso corporal son obligatorios' },
        { status: 400 }
      );
    }

    const metric = await prisma.anthropometricMetric.create({
      data: {
        clientId,
        weightKg: parseFloat(weightKg),
        bodyFatPercent: bodyFatPercent ? parseFloat(bodyFatPercent) : null,
        muscleMassKg: muscleMassKg ? parseFloat(muscleMassKg) : null,
        chestCm: chestCm ? parseFloat(chestCm) : null,
        waistCm: waistCm ? parseFloat(waistCm) : null,
        hipCm: hipCm ? parseFloat(hipCm) : null,
        armCm: armCm ? parseFloat(armCm) : null,
        thighCm: thighCm ? parseFloat(thighCm) : null,
        notes: notes || null,
      },
    });

    return NextResponse.json(metric, { status: 201 });
  } catch (error) {
    console.error('Error al guardar medición:', error);
    return NextResponse.json({ error: 'Error interno al registrar medición' }, { status: 500 });
  }
}