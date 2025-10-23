import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { videoSchema } from '@/lib/validations/videoSchema';

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(videos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = videoSchema.parse(body);
    const video = await prisma.video.create({
      data: validated,
    });
    
    return NextResponse.json(video, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
