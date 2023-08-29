import fetch from 'node-fetch';
import getCurrentTimeInAuckland from './time.common.js'; // Update the path accordingly

const accessToken = process.env.CRON_JOB_ACCESS_TOKEN;

export default async (endpoint) => {
  try {
    const currentTimeInAuckland = await getCurrentTimeInAuckland();

    const futureTime = new Date(currentTimeInAuckland);
    futureTime.setMinutes(futureTime.getMinutes() + 10);

    const cronJobPayload = {
      job: {
        url: `https://www.ezgear.app${endpoint}`,
        enabled: 'true',
        saveResponses: true,
        schedule: {
          timezone: 'Pacific/Auckland',
          minutes: [futureTime.getMinutes().toString()],
          hours: [futureTime.getHours().toString()],
          mdays: [futureTime.getDate().toString()],
          months: [(futureTime.getMonth() + 1).toString()],
          wdays: [futureTime.getDay().toString()],
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

    if (!response.ok) {
      throw new Error(`Failed to schedule cron job ${response}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
