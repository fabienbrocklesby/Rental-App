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
          Content: data.message,
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
