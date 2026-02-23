import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'replaceString' })
export class ReplaceStringPipe implements PipeTransform {
  transform(value: string, searchValue: string, replaceValue: string): string {
    return value.replace(searchValue, replaceValue);
  }
}
