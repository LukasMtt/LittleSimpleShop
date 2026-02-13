import { JsonObject, JsonProperty } from 'typescript-json-serializer';
import { CartItemStorageModel } from './cart-item-storage.model';

@JsonObject()
export class CartStorageModel {
  @JsonProperty() items: CartItemStorageModel[] = [];
}
