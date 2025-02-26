
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/pocetna",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/pocetna"
  },
  {
    "renderMode": 2,
    "route": "/dokumentacija"
  },
  {
    "renderMode": 2,
    "route": "/prijava"
  },
  {
    "renderMode": 2,
    "route": "/prijava-totp"
  },
  {
    "renderMode": 2,
    "route": "/registracija"
  },
  {
    "renderMode": 2,
    "route": "/osobe"
  },
  {
    "renderMode": 2,
    "route": "/filmovi"
  },
  {
    "renderMode": 2,
    "route": "/detalji"
  },
  {
    "renderMode": 2,
    "route": "/dodavanje"
  },
  {
    "renderMode": 2,
    "route": "/korisnici"
  },
  {
    "renderMode": 2,
    "route": "/totp"
  },
  {
    "renderMode": 2,
    "redirectTo": "/prijava",
    "route": "/**"
  }
],
  assets: {
    'index.csr.html': {size: 733, hash: '240bab50f7896726df88a1b6c3cf2d2719087367302252d72bfdc2e29bb7e99e', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1029, hash: 'b229f18caf7fda4c5c866ac7a2bab496197ad5f4e5249d97c7ee6639548a3796', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'prijava/index.html': {size: 3422, hash: 'db4547c9b3c1c36221c1d22d4ed28101c0e3dd3c2ee10c010f2d1e4052b5b0cc', text: () => import('./assets-chunks/prijava_index_html.mjs').then(m => m.default)},
    'pocetna/index.html': {size: 3422, hash: 'db4547c9b3c1c36221c1d22d4ed28101c0e3dd3c2ee10c010f2d1e4052b5b0cc', text: () => import('./assets-chunks/pocetna_index_html.mjs').then(m => m.default)},
    'prijava-totp/index.html': {size: 3422, hash: 'db4547c9b3c1c36221c1d22d4ed28101c0e3dd3c2ee10c010f2d1e4052b5b0cc', text: () => import('./assets-chunks/prijava-totp_index_html.mjs').then(m => m.default)},
    'registracija/index.html': {size: 3422, hash: 'db4547c9b3c1c36221c1d22d4ed28101c0e3dd3c2ee10c010f2d1e4052b5b0cc', text: () => import('./assets-chunks/registracija_index_html.mjs').then(m => m.default)},
    'dokumentacija/index.html': {size: 3422, hash: 'db4547c9b3c1c36221c1d22d4ed28101c0e3dd3c2ee10c010f2d1e4052b5b0cc', text: () => import('./assets-chunks/dokumentacija_index_html.mjs').then(m => m.default)},
    'osobe/index.html': {size: 3422, hash: 'db4547c9b3c1c36221c1d22d4ed28101c0e3dd3c2ee10c010f2d1e4052b5b0cc', text: () => import('./assets-chunks/osobe_index_html.mjs').then(m => m.default)},
    'detalji/index.html': {size: 3422, hash: 'db4547c9b3c1c36221c1d22d4ed28101c0e3dd3c2ee10c010f2d1e4052b5b0cc', text: () => import('./assets-chunks/detalji_index_html.mjs').then(m => m.default)},
    'filmovi/index.html': {size: 3422, hash: 'db4547c9b3c1c36221c1d22d4ed28101c0e3dd3c2ee10c010f2d1e4052b5b0cc', text: () => import('./assets-chunks/filmovi_index_html.mjs').then(m => m.default)},
    'totp/index.html': {size: 3422, hash: 'db4547c9b3c1c36221c1d22d4ed28101c0e3dd3c2ee10c010f2d1e4052b5b0cc', text: () => import('./assets-chunks/totp_index_html.mjs').then(m => m.default)},
    'korisnici/index.html': {size: 3422, hash: 'db4547c9b3c1c36221c1d22d4ed28101c0e3dd3c2ee10c010f2d1e4052b5b0cc', text: () => import('./assets-chunks/korisnici_index_html.mjs').then(m => m.default)},
    'dodavanje/index.html': {size: 3422, hash: 'db4547c9b3c1c36221c1d22d4ed28101c0e3dd3c2ee10c010f2d1e4052b5b0cc', text: () => import('./assets-chunks/dodavanje_index_html.mjs').then(m => m.default)},
    'styles-J7AN5ULT.css': {size: 3993, hash: '0sfpkrwUBz0', text: () => import('./assets-chunks/styles-J7AN5ULT_css.mjs').then(m => m.default)}
  },
};
