import fs from 'fs';

import path from 'path';

const DIRECTORY_DIST = path.join(process.cwd(), 'output');

try {
  fs.mkdirSync(DIRECTORY_DIST);
} catch (e) {}

interface Store<T> {
  data?: T[];
}

export function readStore<T>(fileName: string): Store<T> {
  const filePath = path.join(DIRECTORY_DIST, fileName);
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const data = fs.readFileSync(filePath, {
    encoding: 'utf-8',
  });

  return JSON.parse(data) as Store<T>;
}

export function writeStore<T>(fileName: string, data: Store<T>): void {
  const filePath = path.join(DIRECTORY_DIST, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data));
}
