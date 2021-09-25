import { PiralPlugin } from 'piral';
import { Observable, map, ReplaySubject, distinctUntilChanged, shareReplay } from 'rxjs';
import { Devtools } from './devtools';
import {
  ActionForReducer,
  ActionsForReducers,
  PiletStoreApi,
  Reducers,
  SelectorObservables,
  Selectors,
  Slice,
  SliceConfiguration,
} from './types';
import { buildStateKey } from './utils';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }
}

export function createStoreApi(): PiralPlugin<PiletStoreApi> {
  return () => {
    const slices: Record<string, Slice<any, any, any, any>> = {};

    return (api) => ({
      registerSlice<
        State,
        Name extends string,
        SliceReducers extends Reducers<State>,
        SliceSelectors extends Selectors<State>
      >(
        config: SliceConfiguration<State, Name, SliceReducers, SliceSelectors>
      ): Slice<State, Name, SliceReducers, SliceSelectors> {
        const { name, initialState, reducers, selectors } = config;
        const stateKey = buildStateKey(name);
        const reducerKeys: Array<keyof SliceReducers> = Object.keys(reducers);
        const selectorKeys: Array<keyof SliceSelectors> = Object.keys(selectors);
        const state$$ = new ReplaySubject<State>(1);
        const state$ = state$$.pipe(distinctUntilChanged(), shareReplay(1));
        const devtools = new Devtools(name, initialState, api);

        state$$.next(initialState);

        api.on('store-data', ({ name, value }) => {
          if (name === stateKey) {
            state$$.next(value);
          }
        });

        slices[name] = {
          name,
          initialState,
          actions: reducerKeys.reduce((actions, key) => {
            const reducer = reducers[key];
            type Payload = Parameters<typeof reducer>;
            actions[key] = <ActionForReducer<State, typeof reducer>>((payload: Payload) => {
              const currentState = api.getData(stateKey) || initialState;
              const newState = <State>reducer(currentState, payload);
              api.setData(stateKey, newState);

              devtools.send(key.toString(), payload, newState);
            });

            return actions;
          }, <ActionsForReducers<State, SliceReducers>>{}),
          selectors: selectorKeys.reduce((sel, key) => {
            const selector = selectors[key];
            type Value = ReturnType<typeof selector>;
            sel[key] = <Observable<Value>>state$.pipe(map((value) => selector(value)));

            return sel;
          }, <SelectorObservables<State, SliceSelectors>>{}),
        };

        return slices[name];
      },

      getSlice<S extends Slice<any, any, any, any>>(name: string): S | undefined {
        return <S>slices[name];
      },
    });
  };
}
