import * as React from 'react';
import { useObservable } from '../store/utils';
import { AnotherCounterSlice } from './config';

type Props = {
  selectCounter$: AnotherCounterSlice['selectors']['counter'];
  increment: AnotherCounterSlice['actions']['increment'];
  decrement: AnotherCounterSlice['actions']['decrement'];
};

export function AnotherCounterTile({ selectCounter$, increment, decrement }: Props) {
  const [value] = useObservable(selectCounter$);

  return (
    <div>
      <h4>Counter 2</h4>

      <p>Value: {value}</p>

      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}
