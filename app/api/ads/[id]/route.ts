import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adSchema } from '@/lib/validations/adSchema';



export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await the params Promise
    
    const ad = await prisma.ad.findUnique({
      where: { id },
    });

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }
    return NextResponse.json(ad);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function PUT(
  req: NextRequest,
  { params }:  { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
    const body = await req.json();
    const validated = adSchema.partial().parse(body);

    const ad = await prisma.ad.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json(ad);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }:  { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.ad.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
