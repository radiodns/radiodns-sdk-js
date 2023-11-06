import fs from 'node:fs';
import https from 'node:https';
import readline from 'node:readline';

const url = 'https://raw.githubusercontent.com/radiodns/java-CountryCodeResolver/master/src/org/radiodns/countrycode/countries.csv';

// grab file from GitHub
https.get(url, (response) => {
  // setup to iterate line-by-line
  const handle = readline.createInterface({ input: response });
  // for each line...
  let countries;
  handle.on('line', (line) => {
    // split by comma to get components
    const [, iso, ecc, ccString, nearbyString] = line.split(',');
    // cc of XXXX indicates it's not a "true" country entry
    // split on ; to get each cc and generate all gcc
    const gcc = ccString !== 'XXXX'
      ? ccString.split(';').map((cc) => Number.parseInt(`${cc}${ecc}`, 16))
      : [];
    // parse nearby section, splitting on ; and converting each ecc to number
    const nearby = nearbyString !== ''
      ? nearbyString.split(';')
        .reduce((accumulator, str) => {
          const [key, value] = str.split(':');
          return { ...accumulator, [Number.parseInt(key, 16)]: value.toLowerCase() };
        }, {})
      : {};
    // add the country to the parent object
    countries = {
      ...countries,
      ...{
        [iso.toLowerCase()]: {
          gcc,
          nearby,
        },
      },
    };
  });
  // when file complete, write object to file
  handle.on('close', () => fs.writeFileSync(
    './res/country.json',
    JSON.stringify(countries, null, 2),
  ));
});
