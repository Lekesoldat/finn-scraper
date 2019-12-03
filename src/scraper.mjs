import fetch from 'node-fetch';
import { MARKET_LIST, LOCATIONS, SORT } from './constants.mjs';

const scrape = async (market, search, sort = 'relevant', location = 'Oslo') => {
  const query = `https://www.finn.no/${
    MARKET_LIST[market]
  }/forsale/search.json?location=${LOCATIONS[location]}&q=${encodeURIComponent(
    search
  )}&sort=${SORT[sort]}`;

  console.log(
    'CTRL + click to open search i browser: ',
    query.replace('json', 'html')
  );

  const res = await fetch(query);
  const data = await res.json();

  console.log(`Total hits: ${data.hits}`);

  const items = data.displaySearchResults
    .filter(x => x.titleRow)
    .filter(x => x.bodyRow[0] != 'Ønskes kjøpt')
    .map(x => ({
      url: `https://www.finn.no/${MARKET_LIST[market]}/forsale/ad.html?finnkode=${x.adId}`,
      title: x.titleRow,
      price: parseInt(x.bodyRow[0].replace(/\s/g, '')),
      place: x.topRowCenter
    }));

  console.log(items);
};

scrape('torget', 'air pods', 'høy', 'Oslo');
