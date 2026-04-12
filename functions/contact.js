export async function onRequestPost(context) {
  try {
    const { sellerEmail, buyerName, buyerEmail, buyerMessage, listingTitle } = await context.request.json();

    if (!sellerEmail || !buyerEmail || !buyerMessage) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Dorm Yard Sale <noreply@dormyardsale.com>',
        to: sellerEmail,
        reply_to: buyerEmail,
        subject: `Someone is interested in your listing: ${listingTitle}`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #d4687a;">Someone wants your item! 🏷️</h2>
            <p><strong>${buyerName}</strong> is interested in your listing <strong>"${listingTitle}"</strong> on Dorm Yard Sale.</p>
            <div style="background: #fdf0ed; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
              <p style="margin:0"><strong>Their message:</strong></p>
              <p style="margin: 0.5rem 0 0">${buyerMessage}</p>
            </div>
            <p><strong>Reply to them at:</strong> <a href="mailto:${buyerEmail}">${buyerEmail}</a></p>
            <hr style="border: none; border-top: 1px solid #f0ddd8; margin: 1.5rem 0;">
            <p style="color: #b09090; font-size: 0.85rem;">This message was sent via <a href="https://dormyardsale.com">dormyardsale.com</a></p>
          </div>
        `
      })
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error('Function error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
