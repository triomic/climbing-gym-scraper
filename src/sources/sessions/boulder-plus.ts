import axios from 'axios';
import moment from 'moment';

import type { Session } from '../../models/session';

interface BoulderPlusSession {
  title: string;
  start: string;
  end: string;
}

async function processSession(session: BoulderPlusSession): Promise<Session> {
  const start = moment(session.start).toDate();
  const end = moment(session.end).toDate();

  const spacesMatches = /(\d+) spaces/.exec(session.title);
  let slots;
  if (!spacesMatches) {
    // No matches because slot is "Full".
    // Should verify this in the future.
    slots = 0;
  } else {
    slots = parseInt(spacesMatches[1], 10);
  }

  return {
    gym: 'boulder+',
    start,
    end,
    slots,
  };
}

export default async function boulderPlus(): Promise<Session[]> {
  const res = await axios.get('https://app.rockgympro.com/b/widget/', {
    params: {
      a: 'fcfeed',
      widget_guid: 'f33c8b7f0916487d9af58088967aa62d',
      start: '1612108800',
      end: '1615737600',
    },
  });

  const slots = await Promise.all<Session>(res.data.map(processSession));

  return slots;
}
