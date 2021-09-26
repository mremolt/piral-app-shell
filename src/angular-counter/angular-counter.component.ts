import { Input, Component } from '@angular/core';
import { StoreService } from '../store/store.service';
import { AnotherCounterSlice, anotherCounterKey } from '../another-counter/config';

@Component({
  template: `
    <div>
      <h4>NG Counter</h4>

      <p>Value: {{ slice.selectors.counter | ngrxPush }}</p>

      <button (click)="slice.actions.increment()">Increment</button>
      <button (click)="slice.actions.decrement()">Decrement</button>
    </div>
  `,
})
export class AngularCounterComponent {
  public readonly slice: AnotherCounterSlice;

  constructor(public readonly storeService: StoreService) {
    this.slice = this.storeService.getSlice(anotherCounterKey);
  }
}
