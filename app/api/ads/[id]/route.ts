import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adSchema } from '@/lib/validations/adSchema';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const validated = adSchema.partial().parse(body);

    const ad = await prisma.ad.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json(ad);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.ad.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
