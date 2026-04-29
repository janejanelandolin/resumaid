// Proxy to bridgeworks /docx endpoint to bypass broken CORS preflight on that origin.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const UPSTREAM_BASE = 'https://bridgeworks-api-758224663478.us-central1.run.app/docx';
const DEFAULT_TEMPLATE = 'default';
const DOCX_CONTENT_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const template = url.searchParams.get('template') || DEFAULT_TEMPLATE;
    const raw = await req.text();

    // Workaround: upstream /docx crashes (500) when any project has a non-empty
    // `description` string. Move `description` into `highlights` and drop it.
    let body = raw;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.projects)) {
        parsed.projects = parsed.projects.map((p: any) => {
          if (!p || typeof p !== 'object') return p;
          const { description, ...rest } = p;
          if (typeof description === 'string' && description.trim().length > 0) {
            const highlights = Array.isArray(rest.highlights) ? rest.highlights.slice() : [];
            highlights.unshift(description);
            return { ...rest, highlights };
          }
          return rest;
        });
        body = JSON.stringify(parsed);
      }
    } catch (_) {
      // If body isn't JSON, forward as-is.
    }

    const upstreamUrl = `${UPSTREAM_BASE}?template=${encodeURIComponent(template)}`;
    const upstream = await fetch(upstreamUrl, {
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
    return new Response(buf, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': DOCX_CONTENT_TYPE,
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
