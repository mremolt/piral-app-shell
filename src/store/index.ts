import { produce } from 'immer';
import { PiralPlugin } from 'piral';
import { Observable, map, ReplaySubject, distinctUntilChanged, shareReplay } from 'rxjs';
import { storeService } from '../store/store.service';
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

        const slice = {
          name,
          initialState,
          actions: reducerKeys.reduce((actions, key) => {
            const reducer = reducers[key];
            type Payload = Parameters<typeof reducer>;
            actions[key] = <ActionForReducer<State, typeof reducer>>((payload: Payload) => {
              const currentState: State = api.getData(stateKey) || initialState;
              const newState = produce(currentState, (draft) => {
                return <any>reducer(draft, payload);
              });
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

        storeService.setSlice(slice);

        return slice;
      },

      getSlice<S extends Slice<any, any, any, any>>(name: string): S {
        return storeService.getSlice(name);
      },
    });
  };
}
