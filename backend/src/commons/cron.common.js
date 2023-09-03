import fetch from 'node-fetch';

const accessToken = process.env.CRON_JOB_ACCESS_TOKEN;

export const scheduleCronJob = async (endpoint, futureTime) => {
  try {
    const cronJobPayload = {
      job: {
        url: `https://ezgear.fly.dev${endpoint}`,
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

    console.log(cronJobPayload);

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

    return (await response.json()).jobId;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const deleteCronJob = async (jobId) => {
  try {
    const response = await fetch(`https://api.cron-job.org/jobs/${jobId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete cron job ${response}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
