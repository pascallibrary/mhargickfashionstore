// Webhook for Paystack verification (optional for extra security)
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(await req.json())).digest('hex');

  if (hash !== req.headers.get('x-paystack-signature')) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = await req.json();
  if (event.event === 'charge.success') {
    const reference = event.data.reference;
    // Update order status
    await prisma.order.update({
      where: { id: reference }, // Use reference as order ID or map
      data: { status: 'PAID' },
    });
  }

  return NextResponse.json({ received: true });
}