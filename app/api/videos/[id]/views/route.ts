import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // ✅ 1. Increment the view count on the video
    const updatedVideo = await prisma.video.update({
      where: { id },
      data: {
        views: { increment: 1 },
      },
    });

    // ✅ 2. Create a new view log entry for analytics
    await prisma.view.create({
      data: {
        videoId: id,
      },
    });

    return NextResponse.json({
      message: "View incremented and log stored successfully",
      video: updatedVideo,
    });
  } catch (error: any) {
    console.error("Error updating views:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}