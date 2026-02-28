import { KeyValue } from '@angular/common';

export class PaginationStateModel {
  pageOffset: number = 0;
  pageSize: number = 0;

  getPropertyKeyValueList(): KeyValue<string, string>[] {
    return [
      { key: 'pageOffset', value: `${this.pageOffset}` },
      { key: 'pageSize', value: `${this.pageSize}` }
    ];
  }
}
