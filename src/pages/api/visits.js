import { supabase } from '../../lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('site_visits')
      .select('count')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const total_visits = data ? data.count : 0;

    return new Response(JSON.stringify({ total_visits }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST() {
  try {
    const { data: existingData } = await supabase
      .from('site_visits')
      .select('count')
      .eq('id', 1)
      .single();

    let newVisits = 1;

    if (existingData) {
      newVisits = (existingData.count || 0) + 1;
      await supabase
        .from('site_visits')
        .update({ count: newVisits })
        .eq('id', 1);
    } else {
      await supabase
        .from('site_visits')
        .insert([{ id: 1, count: 1 }]);
    }

    return new Response(JSON.stringify({ success: true, total_visits: newVisits }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
