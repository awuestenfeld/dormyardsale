const { Resend } = require('resend');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const { sellerEmail, buyerName, buyerEmail, buyerMessage, listingTitle } = JSON.parse(event.body);

  if (!sellerEmail || !buyerEmail || !buyerMessage) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: 'Dorm Yard Sale <noreply@dormyardsale.com>',
      to: sellerEmail,
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
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Resend error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' })
    };
  }
};
