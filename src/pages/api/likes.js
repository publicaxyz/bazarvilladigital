import { supabase } from '../../lib/supabase';

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
      .from('product_likes')
      .select('likes_count')
      .eq('product_name', productId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const likes = data ? data.likes_count : 0;

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

    const { data: existingData } = await supabase
      .from('product_likes')
      .select('likes_count')
      .eq('product_name', product_id)
      .single();

    let newLikes = 1;

    if (existingData) {
      newLikes = (existingData.likes_count || 0) + 1;
      await supabase
        .from('product_likes')
        .update({ likes_count: newLikes })
        .eq('product_name', product_id);
    } else {
      await supabase
        .from('product_likes')
        .insert([{ product_name: product_id, likes_count: 1 }]);
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
