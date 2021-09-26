import type { Draft } from 'immer';
import type { Selector } from 'reselect';
import { Observable } from 'rxjs';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletStoreApi {}
}

export interface PiletStoreApi {
  registerSlice<
    State,
    Name extends string,
    SliceReducers extends Reducers<State>,
    SliceSelectors extends Selectors<State>
  >(
    config: SliceConfiguration<State, Name, SliceReducers, SliceSelectors>
  ): Slice<State, Name, SliceReducers, SliceSelectors>;

  getSlice<S extends Slice<any, any, any, any>>(name: string): S;
}

export type Action<P> = (payload: P) => void;
export type ActionWithoutPayload = () => void;

export type NextState<S> = S | void | Draft<S>;

export type Reducer<S = any, RE = (state: S, payload: any) => NextState<S>> = RE extends (
  state: Draft<infer State>,
  payload: infer Payload
) => NextState<S>
  ? Payload extends any
    ? (state: Draft<State>, payload: Payload) => NextState<State>
    : (state: Draft<State>) => NextState<State>
  : (state: Draft<S>) => NextState<S>;

export type ActionForReducer<S, RE> = RE extends (state: Draft<S>, payload: infer Payload) => NextState<S>
  ? Payload extends object | string | number | boolean
    ? Action<Payload>
    : ActionWithoutPayload
  : ActionWithoutPayload;

export type Reducers<S> = {
  [key: string]: Reducer<S>;
};

export type ActionsForReducers<S, R extends Reducers<S>> = {
  [Key in keyof R]: ActionForReducer<S, R[Key]>;
};

export type Selectors<S> = {
  [key: string]: Selector<S, any>;
};

export type SelectorObservables<S, SE extends Selectors<S>> = {
  [Key in keyof SE]: Observable<ReturnType<SE[Key]>>;
};

export interface SliceConfiguration<
  State,
  Name extends string,
  SliceReducers extends Reducers<State>,
  SliceSelectors extends Selectors<State>
> {
  name: Name;
  initialState: State;
  reducers: SliceReducers;
  selectors: SliceSelectors;
}

export interface Slice<
  State,
  Name extends string,
  SliceReducers extends Reducers<State>,
  SliceSelectors extends Selectors<State>
> {
  name: Name;
  initialState: State;
  actions: ActionsForReducers<State, SliceReducers>;
  selectors: SelectorObservables<State, SliceSelectors>;
}

export type SliceFromConfig<
  Config extends SliceConfiguration<State, Name, SliceReducers, SliceSelectors>,
  State = any,
  Name extends string = string,
  SliceReducers extends Reducers<State> = Reducers<State>,
  SliceSelectors extends Selectors<State> = Selectors<State>
> = Slice<Config['initialState'], Config['name'], Config['reducers'], Config['selectors']>;
