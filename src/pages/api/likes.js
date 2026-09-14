import { supabase } from '../../lib/supabase'; // Asegúrate de que la ruta a tu cliente supabase sea correcta

export async function GET({ request }) {
  const url = new URL(request.url);
  const productId = url.searchParams.get('product_id');

  if (!productId) {
    return new Response(JSON.stringify({ error: 'Falta el product_id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { data, error } = await supabase
      .from('product_likes') // Cambia 'product_likes' por el nombre de tu tabla en Supabase
      .select('likes')
      .eq('product_id', productId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const likes = data ? data.likes : 0;

    return new Response(JSON.stringify({ likes }), {
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

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { product_id } = body;

    if (!product_id) {
      return new Response(JSON.stringify({ error: 'Falta el product_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Consultamos si ya existe el registro para este producto
    const { data: existingData } = await supabase
      .from('product_likes')
      .select('likes')
      .eq('product_id', product_id)
      .single();

    let newLikes = 1;

    if (existingData) {
      newLikes = existingData.likes + 1;
      await supabase
        .from('product_likes')
        .update({ likes: newLikes })
        .eq('product_id', product_id);
    } else {
      await supabase
        .from('product_likes')
        .insert([{ product_id, likes: 1 }]);
    }

    return new Response(JSON.stringify({ success: true, likes: newLikes }), {
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
