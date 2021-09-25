import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';
import { Reducers, Selectors, SliceConfiguration } from './types';

export function buildStateKey(name: string): string {
  return `__piral__state__${name}`;
}

export function buildSliceConfig<
  State,
  Name extends string,
  SliceReducers extends Reducers<State>,
  SliceSelectors extends Selectors<State>
>(
  config: SliceConfiguration<State, Name, SliceReducers, SliceSelectors>
): SliceConfiguration<State, Name, SliceReducers, SliceSelectors> {
  return config;
}

export function useObservable<T = any>(observable: Observable<T>) {
  const [value, setValue] = useState<T>();
  const [error, setError] = useState();

  useEffect(() => {
    const subscription = observable.subscribe({ next: setValue, error: setError });
    return () => subscription.unsubscribe();
  }, [observable]);

  return [value, error];
}
