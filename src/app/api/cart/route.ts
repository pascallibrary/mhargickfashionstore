import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
    });
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('GET /api/cart error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId, quantity } = await req.json();
    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const existing = await prisma.cartItem.findFirst({
      where: { userId: session.user.id, productId },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { userId: session.user.id, productId, quantity },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/cart error:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/cart error:', error);
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}