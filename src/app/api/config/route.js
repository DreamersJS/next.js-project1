export const dynamic = 'force-dynamic';

export async function GET() {
  const socketUrl = process.env.SOCKET_URL;
  console.log('GET /api/config ->', socketUrl);
  return Response.json({ socketUrl });
}
