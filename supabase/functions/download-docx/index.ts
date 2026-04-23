// Proxy to bridgeworks /docx endpoint to bypass broken CORS preflight on that origin.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const UPSTREAM = 'https://bridgeworks-api-758224663478.us-central1.run.app/docx';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.text();

    const upstream = await fetch(UPSTREAM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body,
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => '');
      console.error('Upstream /docx failed', upstream.status, errText);
      return new Response(
        JSON.stringify({ error: 'UPSTREAM_ERROR', status: upstream.status, details: errText }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const buf = await upstream.arrayBuffer();
    const contentType =
      upstream.headers.get('content-type') ||
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    return new Response(buf, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
      },
    });
  } catch (err) {
    console.error('download-docx proxy error', err);
    return new Response(
      JSON.stringify({ error: 'PROXY_ERROR', message: err instanceof Error ? err.message : String(err) }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
