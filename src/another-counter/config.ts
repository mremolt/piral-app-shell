import { SliceFromConfig } from '../store/types';
import { buildSliceConfig } from '../store/utils';

export const anotherCounterKey = 'another-counter';

export const anotherCounterConfig = buildSliceConfig({
  name: anotherCounterKey,
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

export type AnotherCounterSlice = SliceFromConfig<typeof anotherCounterConfig>;
