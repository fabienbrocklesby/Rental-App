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
          Content: `<h1>Your one time password is: ${data.otp}</h1><br />`,
          Charset: 'string',
        },
      ],
      Postback: 'string',
      EnvelopeFrom: process.env.EMAIL_FROM_EMAIL,
      From: process.env.EMAIL_FROM_EMAIL,
      Subject: 'EZGear One Time Password',
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

    console.log(data.otp);

    return response;
  } catch (error) {
    return 'Failed to send email';
  }
};
