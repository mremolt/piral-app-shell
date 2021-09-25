import { SliceFromConfig } from '../store/types';
import { buildSliceConfig } from '../store/utils';

export const myCounterKey = 'my-counter';

export const myCounterConfig = buildSliceConfig({
  name: myCounterKey,
  initialState: { counter: 0 },
  reducers: {
    incrementBy: (state, { value }: { value: number }) => ({ counter: state.counter + value }),
    decrementBy: (state, { value }: { value: number }) => ({ counter: state.counter - value }),
    increment: (state) => ({ counter: state.counter + 1 }),
    decrement: (state) => ({ counter: state.counter - 1 }),
  },
  selectors: {
    counter: (state) => state.counter,
  },
});

export type MyCounterSlice = SliceFromConfig<typeof myCounterConfig>;
