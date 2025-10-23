import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adSchema } from '@/lib/validations/adSchema';

export async function GET() {
  try {
    const ads = await prisma.ad.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(ads);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = adSchema.parse(body);

    const ad = await prisma.ad.create({
      data: validated,
    });

    return NextResponse.json(ad, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
