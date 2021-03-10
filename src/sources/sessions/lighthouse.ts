import { Browser } from 'puppeteer';
import moment from 'moment';
import axios from 'axios';

import type { Session } from '../../models/session';

export default async function lighthouse(): Promise<Session[]> {
  const res = await axios(
    'https://api.fitdegree.com/registrables/?event_datetime__GTE=2021-03-07%2016%3A00%3A00&event_datetime__LTE=2021-03-14%2015%3A59%3A59&event_datetime__ORDER=ASC&object_type__IN=%5B1%2C4%2C2%5D&GROUP_BY_DATE=true&show_past=0&is_cancelled=0&display_on_app=1&fitspot_id=231&__fd_client=widgets&__fd_client_version=v2'
  );

  const sessions = res.data.response.data.items.map((session) => ({
    gym: 'Lighthouse',
    start: moment(session.event_datetime, 'YYYY-MM-DD HH:mm:ss').toDate(),
    end: moment(session.end_datetime, 'YYYY-MM-DD HH:mm:ss').toDate(),
    slots: session.max_attendance - session.registration_count,
  }));

  console.log(sessions);

  return sessions;
}
