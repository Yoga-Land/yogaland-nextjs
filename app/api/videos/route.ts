import { prisma } from "@/lib/prisma";
import { videoSchema } from "@/lib/validations/videoSchema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // daily, monthly, total

    // Fetch all views (each record = one view event)
    const views = await prisma.view.findMany({
      orderBy: { createdAt: "asc" },
      include: { video: true },
    });

    // If no views yet
    if (!views.length) {
      return NextResponse.json({ message: "No views yet." });
    }

    // DAILY VIEWS
    if (type === "daily") {
      const dailyMap: Record<string, number> = {};

      views.forEach((v) => {
        const date = new Date(v.createdAt).toLocaleDateString("en-GB");
        dailyMap[date] = (dailyMap[date] || 0) + 1;
      });

      const data = Object.entries(dailyMap).map(([date, count]) => ({
        date,
        views: count,
      }));

      return NextResponse.json(data);
    }

    // MONTHLY VIEWS
    if (type === "monthly") {
      const monthlyMap: Record<string, number> = {};

      views.forEach((v) => {
        const month = new Date(v.createdAt).toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        monthlyMap[month] = (monthlyMap[month] || 0) + 1;
      });

      const data = Object.entries(monthlyMap).map(([month, count]) => ({
        month,
        views: count,
      }));

      return NextResponse.json(data);
    }

    // TOTAL VIEWS
    if (type === "total") {
      const totalViews = views.length;
      return NextResponse.json([{ label: "Total Views", views: totalViews }]);
    }

    // DEFAULT: Return all videos with their total view counts
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { viewLogs: true } },
      },
    });

    const formatted = videos.map((video) => ({
      ...video,
      views: video._count.viewLogs,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching view data:", error);
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