import moment from 'moment-timezone';

const aucklandTimeZone = 'Pacific/Auckland';
const worldTimeApiUrl = 'http://worldtimeapi.org/api/timezone/Pacific/Auckland';

export default async function getCurrentTimeInAuckland() {
  try {
    const response = await fetch(worldTimeApiUrl);
    const responseData = await response.json();

    const aucklandTime = moment.tz(responseData.utc_datetime, 'UTC').tz(aucklandTimeZone);
    return aucklandTime.format('YYYY-MM-DD HH:mm:ss');
  } catch (error) {
    throw new Error(`Error fetching Auckland time: ${error.message}`);
  }
}
