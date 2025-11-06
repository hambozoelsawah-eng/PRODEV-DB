import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // Authentication is handled client-side
  return NextResponse.next({
    request,
  })
}
