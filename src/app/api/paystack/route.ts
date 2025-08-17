// Webhook for Paystack verification (optional for extra security)
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

// Import from our status types file instead of directly from Prisma
import { OrderStatus, PaymentStatus } from '@/lib/types/status';

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY!;
    const body = await req.text(); // Get raw body for signature verification
    const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');

    if (hash !== req.headers.get('x-paystack-signature')) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    
    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      
      // First, check if the order exists using findFirst
      const existingOrder = await prisma.order.findFirst({
        where: { paymentRef: reference },
        select: { id: true, status: true, paymentStatus: true } // Only select what we need
      });

      if (!existingOrder) {
        console.error('Order not found for reference:', reference);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Check if order is already paid to avoid duplicate processing
      if (existingOrder.paymentStatus === PaymentStatus.PAID) {
        console.log('Order already marked as paid:', existingOrder.id);
        return NextResponse.json({ received: true, message: 'Order already processed' });
      }

      // Update both payment status and order status using the unique ID
      const updatedOrder = await prisma.order.update({
        where: { id: existingOrder.id }, // Use the unique ID from the found order
        data: { 
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.CONFIRMED, // Move to confirmed status after payment
          updatedAt: new Date()
        },
      });

      console.log('Order updated successfully:', updatedOrder.id);
      
      // Optional: You can add additional logic here like:
      // - Send confirmation email
      // - Update inventory
      // - Create order history entry
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}