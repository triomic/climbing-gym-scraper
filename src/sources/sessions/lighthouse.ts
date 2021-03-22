import { Browser } from 'puppeteer';
import moment from 'moment';
import axios from 'axios';

import type { Session } from '../../models/session';

export default async function lighthouse(): Promise<Session[]> {
  const res = await axios('https://api.fitdegree.com/registrables/', {
    params: {
      event_datetime__GTE: moment().format('YYYY-MM-DD HH:mm:ss'),
      event_datetime__LTE: moment()
        .add(1, 'week')
        .format('YYYY-MM-DD HH:mm:ss'),
      event_datetime__ORDER: 'ASC',
      object_type__IN: '[1,4,2]',
      GROUP_BY_DATE: true,
      show_past: 0,
      is_cancelled: 0,
      display_on_app: 1,
      fitspot_id: '231',
      __fd_client: 'widgets',
      __fd_client_version: 'v2',
    },
  });

  const sessions = res.data.response.data.items.map((session) => ({
    gym: 'Lighthouse',
    start: moment(session.event_datetime, 'YYYY-MM-DD HH:mm:ss')
      .subtract(8, 'hours')
      .toDate(),
    end: moment(session.end_datetime, 'YYYY-MM-DD HH:mm:ss')
      .subtract(8, 'hours')
      .toDate(),
    spaces: session.max_attendance - session.registration_count,
  }));

  return sessions;
}
