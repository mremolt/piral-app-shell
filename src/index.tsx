import 'core-js/es/reflect';
import 'core-js/stable/reflect';
import 'core-js/features/reflect';

import { renderInstance } from 'piral';
import * as React from 'react';
import { createNgApi } from 'piral-ng';

import { AnotherCounterTile } from './another-counter/AnotherCounterTile';
import { anotherCounterConfig } from './another-counter/config';
import { layout, errors } from './layout';
import { myCounterConfig, myCounterKey, MyCounterSlice } from './my-counter/config';
import { CounterTile } from './my-counter/CounterTile';
import { createStoreApi } from './store';
import { storeService, StoreService } from './store/store.service';
import { ReactiveComponentModule } from '@ngrx/component';
import { AngularCounterComponent } from './angular-counter/angular-counter.component';

// change to your feed URL here (either using feed.piral.cloud or your own service)
const feedUrl = 'https://feed.piral.cloud/api/v1/pilet/empty';

const instance = renderInstance({
  plugins: [
    createStoreApi(),
    createNgApi({
      moduleOptions: {
        providers: [{ provide: StoreService, useValue: storeService }],
        imports: [ReactiveComponentModule],
      },
    }),
  ],
  layout,
  errors,
  requestPilets() {
    return fetch(feedUrl)
      .then((res) => res.json())
      .then((res) => res.items);
  },
});

instance.root.registerSlice(myCounterConfig);
const sl = instance.root.getSlice<MyCounterSlice>(myCounterKey)!;
sl.actions.incrementBy({ value: 8 });

const sl2 = instance.root.registerSlice(anotherCounterConfig);

instance.root.registerTile(
  'counter-tile',
  () => (
    <CounterTile
      selectCounter$={sl.selectors.counter}
      increment={sl.actions.increment}
      decrement={sl.actions.decrement}
    />
  ),
  { initialColumns: 2, initialRows: 2 }
);

instance.root.registerTile(
  'another-counter-tile',
  () => (
    <AnotherCounterTile
      selectCounter$={sl2.selectors.counter}
      increment={sl2.actions.increment}
      decrement={sl2.actions.decrement}
    />
  ),
  { initialColumns: 2, initialRows: 2 }
);

instance.root.registerTile('ng-tile', instance.root.fromNg(AngularCounterComponent, { ngZone: 'noop' }));

export * from './store';
export * from './store/types';
export * from './store/store.service';
export * from './my-counter/config';
export * from './another-counter/config';
