# @radiodns/core

Construct and resolve radio bearer objects from and to a number of standardised formats, defined in the RadioDNS hybrid radio technical standard ETSI TS 103 270.

## Installation

```sh
npm install @radiodns/core
```

## Quickstart

```js
import { Bearer, FMBearer, resolveBearer } from '@radiodns/core'

/**
 * Instantiate a type of Bearer with parameter arguments. Constructors will accept numbers or string representations of numbers.
 */
const fmBearer = new FMBearer(0xce1, 0xc675, 107.2);
bearer.toUri() // 'fm:ce1.c675.10720'

/**
 * FM bearers allow a ECC, GCC or ISO country code value for their initial country argument and utilising the country code table will silently correct errors based on neighbouring country reception.
 */
const dabBearer = new FMBearer('fr', 0xc675, 107.2)
bearer.toUri() // 'fm:ce1.c675.10720' - France 'fr' changed to UK 'ce1' for SId beginning with 'c'

/**
 * Instantiate a type of Bearer from a URI string and return it as an FQDN. Methods are available for parsing and outputting between URI, FQDN and service identifier formats.
 */
const bearer = Bearer.fromUri('fm:ce1.c675.10720')
bearer.toFqdn() // '10720.c675.ce1.fm.radiodns.org'

/**
 * Lookup a bearer object, a URI string or an object literal with the required parameters. Returns a promise that resolves to the authoritative FQDN for that bearer.
 */
await resolveBearer(bearer) // 'rdns.musicradio.com'
```

## Licence

Licensed under the Apache License, Version 2.0 (the "License"). You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.

Copyright (c) 2023 RadioDNS Limited
