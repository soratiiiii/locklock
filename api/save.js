export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { id, data } = req.body;
  if (!id || !data) return res.status(400).json({ error: 'missing fields' });

  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/locks`, {
    method: 'POST',
    headers: {
      'apikey': process.env.SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, data }),
  });

  if (!response.ok) return res.status(500).json({ error: 'db error' });
  res.status(200).json({ ok: true });
}
