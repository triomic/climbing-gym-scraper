import axios from 'axios';
import moment from 'moment';
import { flattenDeep } from 'lodash';

import type { Session } from '../../models/session';

async function processSlot(slot, subMetadata, isWeekend): Promise<Session> {
  const dateString = slot.split('_')[0];
  const start = moment(dateString, 'YYYYMMDDkkmm').toDate();

  const endMoment = moment(dateString, 'YYYYMMDDkkmm');
  if (isWeekend) {
    endMoment.add(2, 'hours').add(45, 'minutes');
  } else {
    endMoment.add(3, 'hours');
  }
  const end = endMoment.toDate();

  const spaces = subMetadata[slot].split('/').map((comp) => comp.trim())[0];

  return {
    gym: 'Boulder World',
    start,
    end,
    spaces,
  };
}

async function processClass(klass, isWeekend): Promise<Session[]> {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const res = await axios.get(
    'https://www.picktime.com/book/getClassAppSlots',
    {
      params: {
        _: '1614754760505',
        locationId: 'ca204f51-922f-42e3-bdb6-1f8373eb5268',
        accountKey: '566fe29b-2e46-4a73-ad85-c16bfc64b34b',
        serviceKeys: klass,
        staffKeys: '',
        endDateAndTime: moment(lastDayOfMonth).format('YYYYMMDD') + '2359',
        v2: true,
      },
    }
  );

  const slots = await Promise.all<Session>(
    res.data.data.map((slot) =>
      processSlot(slot, res.data.subMetadata, isWeekend)
    )
  );

  return slots;
}

export default async function boulderWorld(): Promise<Session[]> {
  const classes = await Promise.all([
    processClass('2be7247c-4c08-42c5-beb4-1678c449d108', true),
    processClass('6a9c21f1-7d99-40c8-9369-642088d7063f', false),
  ]);

  return flattenDeep(classes);
}
