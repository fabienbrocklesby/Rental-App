import fetch from 'node-fetch';

export default async (data) => {
  const emailData = {
    Recipients: {
      To: [data.email],
    },
    Content: {
      Body: [
        {
          ContentType: 'HTML',
          Content: `
            <div style="margin: 0; padding: 0; font-family: Arial, sans-serif;">

            <div style="background-color: #dde3ed; padding: 20px; text-align: center;">
                <img src="https://ezgear.app/images/Logo.png" alt="EZGear Logo" style="width: 20vh; max-width: 150px;">
            </div>
            
            <div style="padding: 20px; text-align: center;">
                <h1 style="font-size: 24px; color: #333;">${data.message}</h1>
                <p style="font-size: 16px; color: #555;">For any inquiries, please contact us at <a href="mailto:contact@ezgear.app" style="color: #007BFF; text-decoration: none;">contact@ezgear.app</a>.</p>
                <p style="font-size: 16px; color: #555;">Visit our website at <a href="https://ezgear.app" style="color: #007BFF; text-decoration: none;">ezgear.app</a> for more information.</p>
            </div>
          
          </div>`,
          Charset: 'string',
        },
      ],
      Postback: 'string',
      EnvelopeFrom: process.env.EMAIL_FROM_EMAIL,
      From: process.env.EMAIL_FROM_EMAIL,
      Subject: 'EZGear',
    },
  };

  const url = 'https://api.elasticemail.com/v4/emails/transactional';

  const headers = {
    'Content-Type': 'application/json',
    'X-ElasticEmail-ApiKey': process.env.EMAIL_API_KEY,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(emailData),
    });

    console.log(data.message);

    return response;
  } catch (error) {
    return 'Failed to send email';
  }
};
