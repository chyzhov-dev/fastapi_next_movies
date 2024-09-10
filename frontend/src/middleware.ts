import { env } from "@/env";
import { type NextRequest, NextResponse } from "next/server";

const authRoute = "/auth";
const defaultDashboardRoute = "/dashboard/movies";
const guestRoutes = [authRoute];
const protectedRoutes = [defaultDashboardRoute];

const isPartOfArray = (arr: string[], str: string) => {
  let found = false;
  for (const item of arr) {
    if (str.includes(item)) {
      found = true;
      break;
    }
  }

  return found;
};

export async function middleware(req: NextRequest) {
  let { pathname } = req.nextUrl;

  if (pathname === "/") {
    pathname = defaultDashboardRoute;
  }

  const access_token = req.cookies.get("access_token");
  if (!access_token) {
    if (isPartOfArray(protectedRoutes, pathname)) {
      return NextResponse.redirect(new URL(authRoute, req.url));
    }

    return;
  }

  const body = {
    access_token: access_token?.value,
  };
  const response = await fetch(
    `${env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (response.status !== 200) {
    return NextResponse.redirect(new URL(authRoute, req.url));
  }
  if (response.headers.get("Content-Type") !== "application/json") {
    return NextResponse.redirect(new URL(authRoute, req.url));
  }

  const json = await response.json();
  if (json.error) {
    return NextResponse.redirect(new URL(authRoute, req.url));
  }

  if (isPartOfArray(guestRoutes, pathname)) {
    return NextResponse.redirect(new URL(defaultDashboardRoute, req.url), {
      headers: response.headers,
    });
  }

  const nextResponse = NextResponse.next();
  nextResponse.headers.set("Set-Cookie", response.headers.get("Set-Cookie")!);

  return nextResponse;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
