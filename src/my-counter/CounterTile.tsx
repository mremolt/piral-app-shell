import * as React from 'react';
import { useObservable } from '../store/utils';
import { MyCounterSlice } from './config';

type Props = {
  selectCounter$: MyCounterSlice['selectors']['counter'];
  increment: MyCounterSlice['actions']['increment'];
  decrement: MyCounterSlice['actions']['decrement'];
};

export function CounterTile({ selectCounter$, increment, decrement }: Props) {
  const [value] = useObservable(selectCounter$);

  return (
    <div>
      <h4>Counter</h4>

      <p>Value: {value}</p>

      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}
