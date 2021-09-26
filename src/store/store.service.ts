import { Injectable } from '@angular/core';
import { Slice } from '..';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly slices: Record<string, Slice<any, any, any, any>> = {};

  public setSlice<S extends Slice<any, any, any, any>>(slice: S): void {
    this.slices[slice.name] = slice;
  }

  public getSlice<S extends Slice<any, any, any, any>>(name: string): S {
    if (!this.slices[name]) {
      throw new Error(`Slice with name "${name}" is not registered!`);
    }
    return <S>this.slices[name];
  }
}

export const storeService = new StoreService();
