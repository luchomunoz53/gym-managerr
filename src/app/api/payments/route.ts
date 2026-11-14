import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, amount, paymentMethod, daysToAdd = 30 } = body;

    if (!clientId || !amount) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    // Si la membresía actual ya está vencida, sumamos a partir de hoy.
    // Si aún está vigente, acumulamos los días a su fecha de expiración actual.
    const today = new Date();
    const currentExpiry = new Date(client.membershipExpiry);
    const baseDate = currentExpiry > today ? currentExpiry : today;

    const newExpiryDate = new Date(baseDate);
    newExpiryDate.setDate(newExpiryDate.getDate() + parseInt(daysToAdd, 10));

    const refNumber = `REC-${Date.now().toString(36).toUpperCase()}`;

    // Transacción atómica: actualizamos cliente y creamos registro de cobro
    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          clientId: client.id,
          amount: parseFloat(amount),
          paymentMethod: paymentMethod || 'Efectivo',
          nextDueDate: newExpiryDate,
          reference: refNumber,
        },
      });

      const updatedClient = await tx.client.update({
        where: { id: client.id },
        data: {
          membershipExpiry: newExpiryDate,
        },
      });

      return { payment, updatedClient };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error al renovar membresía:', error);
    return NextResponse.json({ error: 'Error al procesar la renovación' }, { status: 500 });
  }
}