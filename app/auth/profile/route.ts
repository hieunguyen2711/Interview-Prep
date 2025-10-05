import { auth0 } from "../../../lib/auth0";

export async function GET() {
  const session = await auth0.getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  return Response.json(session.user);
}


