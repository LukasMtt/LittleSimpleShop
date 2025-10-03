import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {}

  setStorageItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getStorageItem(key: string): string | null {
    return localStorage.getItem(key);
  }
}
