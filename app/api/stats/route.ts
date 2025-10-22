import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalVideos, totalAds, activeAds] = await Promise.all([
      prisma.video.count(),
      prisma.ad.count(),
      prisma.ad.count({ where: { active: true } }),
    ]);

    return NextResponse.json({
      totalVideos,
      totalAds,
      activeAds,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
