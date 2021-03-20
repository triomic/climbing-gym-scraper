import axios from 'axios';
import moment from 'moment';
import { flattenDeep } from 'lodash';

import type { Session } from '../../models/session';

async function processSlot(slot, subMetadata): Promise<Session> {
  const dateString = slot.split('_')[0];
  const start = moment(dateString, 'YYYYMMDDkkmm').toDate();
  const end = moment(dateString, 'YYYYMMDDkkmm').add(2, 'hours').toDate(); // TODO: don't assume oyeyo time slot length

  const spaces = subMetadata[slot].split('/').map((comp) => comp.trim())[0];

  return {
    gym: 'Oyeyo',
    start,
    end,
    spaces,
  };
}

async function processStaff(klass, staff): Promise<Session[]> {
  const res = await axios.get(
    'https://www.picktime.com/book/getClassAppSlots',
    {
      params: {
        locationId: '07e26051-689f-471c-8201-bf03796a6a04',
        accountKey: '5176b721-0be8-447e-b43b-3652af54bd7b',
        serviceKeys: klass,
        staffKeys: staff,
        endDateAndTime: '202103312359', // TODO: get1stDate n stuff
        v2: true,
      },
    }
  );

  const slots = await Promise.all<Session>(
    res.data.data.map(async (slot) => processSlot(slot, res.data.subMetadata))
  );

  return slots;
}

async function processClass(klass): Promise<Session[][]> {
  const res = await axios.get(
    'https://www.picktime.com/book/getStaffForCurrentClass',
    {
      params: {
        locationId: '07e26051-689f-471c-8201-bf03796a6a04',
        accountKey: '5176b721-0be8-447e-b43b-3652af54bd7b',
        serviceKeys: klass,
      },
    }
  );

  const staffs = await Promise.all<Session[]>(
    res.data.data.map((staff) => processStaff(klass, staff))
  );

  return staffs;
}

export default async function oyeyo(): Promise<Session[]> {
  const res = await axios.get(
    'https://www.picktime.com/book/getClassesForCurrentLocation',
    {
      params: {
        locationId: '07e26051-689f-471c-8201-bf03796a6a04',
        accountKey: '5176b721-0be8-447e-b43b-3652af54bd7b',
      },
    }
  );

  const classes = await Promise.all<Session[][]>(
    res.data.data.map(processClass)
  );

  return flattenDeep(classes);
}
