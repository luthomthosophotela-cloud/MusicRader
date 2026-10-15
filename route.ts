import { NextResponse } from "next/server";
import { getNewReleases } from "@/lib/spotify";
export const revalidate = 3600;
export async function GET() { return NextResponse.json(await getNewReleases()); }
