// Cloudflare Analytics Engine endpoint
// Receives events from the frontend and sends them to Analytics Engine

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();

    // Validate event structure
    if (!data.eventName || !data.timestamp) {
      return new Response(JSON.stringify({ error: 'missing eventName or timestamp' }), { status: 400 });
    }

    // Send to Cloudflare Analytics Engine
    // The event will be available in queries within a few minutes
    if (env.ANALYTICS_ENGINE) {
      env.ANALYTICS_ENGINE.writeDataPoint({
        indexes: [data.eventName, data.tool || 'unknown'],
        blobs: [data.url || '', JSON.stringify(data)],
        timestamps: [Math.floor(new Date(data.timestamp).getTime() / 1000)]
      });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
