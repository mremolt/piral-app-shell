import { PiletApi } from 'piral-base';
import { buildStateKey } from './utils';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }
}

export interface Message {
  type: string;
  state: string;
}

export class Devtools<S, N extends string> {
  private readonly devtools?: any;

  constructor(private readonly name: N, initialState: S, api: PiletApi) {
    const stateKey = buildStateKey(name);

    this.devtools =
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__.connect({ name, trace: true });

    this.devtools?.subscribe((message: Message) => {
      if (message.type === 'DISPATCH' && message.state) {
        try {
          // State is not always JSON parsable - raw string for example
          api.setData(stateKey, JSON.parse(message.state));
        } catch (e) {
          api.setData(stateKey, message.state);
        }
      }
    });

    this.devtools?.init(initialState);
  }

  public send(key: string, payload: any, state: S): void {
    this.devtools?.send({ type: `[${this.name}] ${key}`, payload }, state, this.name);
  }
}
