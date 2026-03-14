import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { id } = req.query;

  const { data, error } = await supabase
    .from('locks')
    .select('data, hint, expires_at')
    .eq('id', id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'not found' });

  // 만료 체크
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    // 만료된 데이터 삭제
    await supabase.from('locks').delete().eq('id', id);
    return res.status(410).json({ error: 'expired' });
  }

  return res.status(200).json({ data: data.data, hint: data.hint });
}
