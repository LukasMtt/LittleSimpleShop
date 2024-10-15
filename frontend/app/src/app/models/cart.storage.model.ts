import { JsonObject, JsonProperty } from "typescript-json-serializer";
import { CartItemStorage } from "./cart.item.storage.model";

@JsonObject()
export class CartStorage {
  @JsonProperty() items: CartItemStorage[] = [];
}