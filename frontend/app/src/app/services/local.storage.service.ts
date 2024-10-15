import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {
  }

  setStorageItem(key: string, value: string) {
    localStorage.setItem(key, value)
  }

  getStorageItem(key: string) {
    return localStorage.getItem(key);
  }
}
