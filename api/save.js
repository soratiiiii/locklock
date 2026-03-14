import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { id, data, hint, expiresIn } = req.body;

  // expiresIn: 분 단위 (0 = 무제한)
  const expires_at = expiresIn
    ? new Date(Date.now() + expiresIn * 60 * 1000).toISOString()
    : null;

  const { error } = await supabase
    .from('locks')
    .insert([{ id, data, hint: hint || null, expires_at }]);

  if (error) return res.status(500).json({ error });
  return res.status(200).json({ ok: true });
}
