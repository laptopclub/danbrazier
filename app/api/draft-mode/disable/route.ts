import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "../../../../lib/env";

export async function GET() {
  const mode = await draftMode();
  mode.disable();

  return NextResponse.redirect(new URL("/", env.siteUrl));
}
