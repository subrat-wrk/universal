import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModuleNgFactory } from './src/main.server';

// Hapi server
function run() {
  const app = express();
  const port: string | number = process.env.PORT || 4000;
  const distFolder = join(process.cwd(), 'dist/hapi-engine-ve/browser');

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  app.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
  }));

  app.set('view engine', 'html');
  app.set('views', distFolder);

  // Example Express Rest API endpoints
  // app.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  app.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  app.get('*', (req, res) => {
    res.render('index', { req });
  });

  // Start up the Node server
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
if (mainModule && mainModule.filename === __filename) {
  run();
}

export * from './src/main.server';
