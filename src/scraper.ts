import 'ts-polyfill/lib/es2019-array';

import puppeteer, { Browser } from 'puppeteer';
import blackball from './sources/boba/blackball';
import eachACup from './sources/boba/each-a-cup';
import koi from './sources/boba/koi';
import liho from './sources/boba/liho';

import { Boba } from './sources/boba/model';

import * as Sentry from '@sentry/node';
import { readStore, writeStore } from './output';
import chicha from './sources/boba/chicha';
import tigersugar from './sources/boba/tiger-sugar';
import playmade from './sources/boba/playmade';

import fs from 'fs';

const { NODE_ENV, SENTRY_DSN } = process.env;

const isProduction = NODE_ENV === 'production';

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
  });
}

try {
  fs.mkdirSync('traces');
} catch (e) {}

async function boba(browser: Browser) {
  async function tempFunc(
    chainName: string,
    workFunc: (browser: Browser) => Promise<Boba[]>
  ) {
    const data = await workFunc(browser);

    const store = readStore('boba.json');
    writeStore('boba.json', {
      ...store,
      [chainName]: data,
    });
  }

  await Promise.all([
    tempFunc('BlackBall', blackball),
    tempFunc('Each-A-Cup', eachACup),
    tempFunc('Koi', koi),
    tempFunc('LiHO', liho),
    tempFunc('ChiCha', chicha),
    tempFunc('Tiger Sugar', tigersugar),
    tempFunc('Playmade', playmade),
  ]);
}

async function scraper() {
  const isARMMac = process.arch === 'arm64' && process.platform === 'darwin';

  const browser = await puppeteer.launch({
    headless: isProduction,
    defaultViewport: null,
    args: isProduction ? ['--no-sandbox'] : [],
    executablePath: isARMMac
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : undefined,
  });

  await boba(browser);

  await browser.close();
}

scraper()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    Sentry?.captureException(e);
    process.exit(1);
  });
