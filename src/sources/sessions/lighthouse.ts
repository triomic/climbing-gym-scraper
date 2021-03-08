import { Browser } from 'puppeteer';
import { Session } from '../../models/session';
import moment from 'moment';

export default async function lighthouse(
  browser: Browser
): Promise<Session[]> {}

// fetch("https://api.fitdegree.com/registrables/?event_datetime__GTE=2021-03-07%2016%3A00%3A00&event_datetime__LTE=2021-03-14%2015%3A59%3A59&event_datetime__ORDER=ASC&object_type__IN=%5B1%2C4%2C2%5D&GROUP_BY_DATE=true&show_past=0&is_cancelled=0&display_on_app=1&fitspot_id=231&__fd_client=widgets&__fd_client_version=v2", {
//   "headers": {
//     "accept": "application/json, text/plain, */*",
//     "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
//     "cache-control": "no-cache",
//     "content-type": "application/json",
//     "pragma": "no-cache",
//     "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-site"
//   },
//   "referrer": "https://widget.fitdegree.com/",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": null,
//   "method": "GET",
//   "mode": "cors",
//   "credentials": "omit"
// });
