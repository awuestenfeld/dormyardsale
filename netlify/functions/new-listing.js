export async function onRequestPost(context) {
  try {
    const { title, price, college, state, category, condition, description, sellerEmail } = await context.request.json();

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Dorm Yard Sale <noreply@dormyardsale.com>',
        to: 'hello@dormyardsale.com',
        subject: `🏷️ New listing: ${title} — ${college}, ${state}`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #d4687a;">New listing posted! 🏷️</h2>
            <table style="width:100%;border-collapse:collapse;margin:1rem 0">
              <tr><td style="padding:0.4rem 0;color:#b09090;width:120px">Title</td><td style="padding:0.4rem 0"><strong>${title}</strong></td></tr>
              <tr><td style="padding:0.4rem 0;color:#b09090">Price</td><td style="padding:0.4rem 0"><strong>$${price}</strong></td></tr>
              <tr><td style="padding:0.4rem 0;color:#b09090">School</td><td style="padding:0.4rem 0">${college}, ${state}</td></tr>
              <tr><td style="padding:0.4rem 0;color:#b09090">Category</td><td style="padding:0.4rem 0">${category}</td></tr>
              <tr><td style="padding:0.4rem 0;color:#b09090">Condition</td><td style="padding:0.4rem 0">${condition}</td></tr>
              <tr><td style="padding:0.4rem 0;color:#b09090">Seller</td><td style="padding:0.4rem 0">${sellerEmail}</td></tr>
              ${description ? `<tr><td style="padding:0.4rem 0;color:#b09090;vertical-align:top">Description</td><td style="padding:0.4rem 0">${description}</td></tr>` : ''}
            </table>
            <a href="https://dormyardsale.com" style="display:inline-block;background:#d4687a;color:#fff;padding:0.6rem 1.2rem;border-radius:8px;text-decoration:none;font-weight:600">View on Site →</a>
            <hr style="border:none;border-top:1px solid #f0ddd8;margin:1.5rem 0">
            <p style="color:#b09090;font-size:0.85rem;">dormyardsale.com admin notification</p>
          </div>
        `
      })
    });

    if (!res.ok) {
      console.error('Resend error:', await res.text());
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error('Function error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
