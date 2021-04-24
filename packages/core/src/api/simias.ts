import { ExecuteCore, Run, SimiasStore } from './d';
import AbortController from 'abort-controller';

const fetch = require('node-fetch');

const store: SimiasStore = {
  request: {
    abortController: null
  }
};

const run: Run = {
  'request.REST': async ({ respond }, { url, options }) => {
    console.warn(321);
    if (store.request.abortController) {
      store.request.abortController.abort();
      store.request.abortController = null;
    }
    store.request.abortController = new AbortController();
    try {
      const request = await fetch(url, {
        method: 'GET',
        signal: store.request.abortController.signal,
        ...options
      });
      const response = await request.buffer();
      const headers = request.headers.raw();

      respond({ response, headers });
    } catch (e) {
      respond({ error: e.toString() + ' while performing REST request' });
    }
  },
  'request.cancel': async ({ respond }) => {
    if (store.request.abortController) {
      store.request.abortController.abort();
      store.request.abortController = null;
    }
    respond();
  }
};

export default function (core: ExecuteCore, instructions: string[], payload: object) {
  const command = run[instructions.join('.')];
  if (command) { command(core, payload); }
  else {
    core.respond({ ...payload, __action: instructions.join('.') });
  }
}