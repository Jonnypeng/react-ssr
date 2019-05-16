import express, { Application } from 'express';
// import delay from 'delay';
// import got from 'got';
import { Config } from './config';
// import * as spinner from './spinner';

export function ReactSsrExpress(config: Config = {}) {
  const app: Application = express();

  config = {
    ...(new Config),
    ...config,
  };

  if (!config.engine) {
    throw new Error('InvalidProgramException: view engine must be specified.');
  }

  if (!['jsx', 'tsx'].includes(config.engine)) {
    throw new Error(`The engine ${config.engine} is not supported.`);
  }

  require(`@react-ssr/express-engine-${config.engine}`)(app, config);

  // const _listen = app.listen;

  // const buildSync = async (route: string) => {
  //   let done: boolean = false;

  //   try {
  //     spinner.create(`Building '${route}'`);
  //     await got(`http://localhost:8888${route}`);
  //     done = true;
  //   } catch (e) {
  //     spinner.fail(e.response.body);
  //     process.exit(1);
  //   }

  //   while (true) {
  //     await delay(300);
  //     if (done) {
  //       break;
  //     }
  //   }
  // };
  for (let i = 0; i < app._router.stack.length; i++) {
    const r = app._router.stack[i];
    if (r.route && r.route.path) {
      console.log(r.route.path);
    }
  }

  // app.listen = (...args: any[]) => {
  //   if (args.length === 0) {
  //     throw new Error('1 - 4 arguments must be specified.');
  //   }

    

  //   const [port, ...rest] = args;
  //   // spinner.clear(`> Ready on http://localhost:${port}`);

  //   return _listen(port, ...rest);
  // };

  return app;
}
