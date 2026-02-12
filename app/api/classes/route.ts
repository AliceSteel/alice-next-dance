export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { fetchClasses } from "@/helpers/actions";

export async function GET() {
  const classes = await fetchClasses(); 
  return NextResponse.json(classes);
}