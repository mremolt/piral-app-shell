import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveComponentModule } from '@ngrx/component';
import { StoreService, storeService } from '../store/store.service';

import { AngularCounterComponent } from './angular-counter.component';

@NgModule({
  declarations: [AngularCounterComponent],
  bootstrap: [AngularCounterComponent],
  imports: [CommonModule, ReactiveComponentModule],
  providers: [{ provide: StoreService, useValue: storeService }],
})
export class AngularCounterModule {}
