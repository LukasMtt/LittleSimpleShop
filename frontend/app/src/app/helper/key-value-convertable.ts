import { KeyValue } from "@angular/common";

export declare interface KeyValueConvertable {
    convertToKeyValueList(): KeyValue<string, string>[]
}