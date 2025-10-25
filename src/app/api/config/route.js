export const dynamic = 'force-dynamic';

export async function GET() {
  const socketUrl = process.env.SOCKET_URL;
  return Response.json({ socketUrl });
}
