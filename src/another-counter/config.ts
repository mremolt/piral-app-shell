import { SliceFromConfig } from '../store/types';
import { buildSliceConfig } from '../store/utils';

export const anotherCounterKey = 'another-counter';

export const anotherCounterConfig = buildSliceConfig({
  name: anotherCounterKey,
  initialState: { counter: 0 },
  reducers: {
    incrementBy: (state, { value }: { value: number }) => {
      state.counter += value;
    },
    decrementBy: (state, { value }: { value: number }) => ({ counter: state.counter - value }),
    // without return, using immer
    increment: (state) => {
      state.counter += 1;
    },
    // classic reducer
    decrement: (state) => ({ counter: state.counter - 1 }),
  },
  selectors: {
    counter: (state) => state.counter,
  },
});

export type AnotherCounterSlice = SliceFromConfig<typeof anotherCounterConfig>;
