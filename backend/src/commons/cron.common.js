import fetch from 'node-fetch';

const accessToken = process.env.CRON_JOB_ACCESS_TOKEN;

export default async (endpoint, cartExpiry) => {
  const futureTime = cartExpiry;

  const cronJobPayload = {
    job: {
      url: `https://www.ezgear.app/${endpoint}`,
      enabled: 'true',
      saveResponses: true,
      schedule: {
        timezone: 'Pacific/Auckland',
        minutes: [futureTime.getMinutes().toString()],
        hours: [futureTime.getHours().toString()],
        mdays: [futureTime.getDate().toString()],
        months: [(futureTime.getMonth() + 1).toString()], // Month is 0-based
        wdays: ['*'],
      },
    },
  };

  const response = await fetch('https://api.cron-job.org/jobs', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(cronJobPayload),
  });

  console.log(response);

  if (!response.ok) {
    throw new Error(`Failed to schedule cron job ${response}`);
  }
};
