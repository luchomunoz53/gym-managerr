import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, membershipPlan, membershipExpiry, coachId, initialAmount, paymentMethod } = body;

    if (!name || !membershipPlan || !membershipExpiry || !coachId) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const expiryDate = new Date(membershipExpiry);

    const newClient = await prisma.$transaction(async (tx) => {
      const client = await tx.client.create({
        data: {
          name,
          email: email || null,
          phone: phone || null,
          membershipPlan,
          membershipExpiry: expiryDate,
          coachId,
        },
      });

      if (initialAmount && parseFloat(initialAmount) > 0) {
        const refNumber = `REC-${Date.now().toString(36).toUpperCase()}`;
        await tx.payment.create({
          data: {
            clientId: client.id,
            amount: parseFloat(initialAmount),
            paymentMethod: paymentMethod || 'Efectivo',
            nextDueDate: expiryDate,
            reference: refNumber,
          },
        });
      }

      return client;
    });

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error('Error al registrar cliente:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}