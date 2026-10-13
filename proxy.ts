import { NextRequest, NextResponse } from "next/server"

export async function proxy(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  const authHeader = req.headers.get("authorization")
  const expected = `Basic ${process.env.ADMIN_SECRET}`

  if (authHeader === expected) {
    return NextResponse.next()
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin"',
    },
  })
}

export const config = {
  matcher: "/admin/:path*",
}
