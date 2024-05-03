import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "~/lib/db";
import { startups } from "~/lib/schema";

export async function GET(request: NextRequest) {
  try {
    const idParam = request.nextUrl.searchParams.get("id");

    if (idParam) {
      // only get one
      const id = parseInt(idParam);
      const startup = await db.query.startups.findFirst({
        where: eq(startups.id, id),
      });
      return Response.json({ startup });
    }

    // get all
    const startupsResult = await db.query.startups.findMany();
    return Response.json({ startups: startupsResult });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "An error has occurred." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    await db
      .insert(startups)
      .values({ ...data, foundedDate: new Date(data.foundedDate) });
    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "An error has occurred." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id } = data;
    await db
      .update(startups)
      .set({ ...data, foundedDate: new Date(data.foundedDate) })
      .where(eq(startups.id, id));
    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "An error has occurred." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const idParam = request.nextUrl.searchParams.get("id");
    if (!idParam) {
      return Response.json({ error: "Invalid startup id." }, { status: 400 });
    }
    const id = parseInt(idParam);
    await db.delete(startups).where(eq(startups.id, id));
    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "An error has occurred." }, { status: 500 });
  }
}
