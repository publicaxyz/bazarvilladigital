import { supabase } from '../../lib/supabase'; // Asegúrate de que la ruta a tu cliente supabase sea correcta

export async function GET() {
  try {
    // Buscamos el registro general de visitas (puedes usar un id fijo como 1 o 'global')
    const { data, error } = await supabase
      .from('site_visits') // Nombre de tu tabla de visitas en Supabase
      .select('total_visits')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const total_visits = data ? data.total_visits : 0;

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
    // Primero obtenemos el valor actual
    const { data: existingData } = await supabase
      .from('site_visits')
      .select('total_visits')
      .eq('id', 1)
      .single();

    let newVisits = 1;

    if (existingData) {
      newVisits = existingData.total_visits + 1;
      await supabase
        .from('site_visits')
        .update({ total_visits: newVisits })
        .eq('id', 1);
    } else {
      await supabase
        .from('site_visits')
        .insert([{ id: 1, total_visits: 1 }]);
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
