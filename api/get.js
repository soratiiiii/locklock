export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'missing id' });

  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/locks?id=eq.${id}&select=data`,
    {
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      },
    }
  );

  const rows = await response.json();
  if (!rows.length) return res.status(404).json({ error: 'not found' });
  res.status(200).json({ data: rows[0].data });
}
