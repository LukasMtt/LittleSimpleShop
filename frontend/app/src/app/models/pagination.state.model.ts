import { KeyValue } from "@angular/common"
import { KeyValueConvertable } from "./key.value.convertable.model"

export class PaginationState implements KeyValueConvertable {
    pageOffset: number = 0
    pageSize: number = 0

    convertToKeyValueList(): KeyValue<string, string>[] {
        return [
            {key: "pageOffset", value: `${this.pageOffset}`},
            {key: "pageSize", value: `${this.pageSize}`}
        ];
    }
}