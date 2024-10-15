import { JsonObject, JsonProperty } from "typescript-json-serializer";

@JsonObject()
export class CartItemStorage {
  @JsonProperty() productId: number = 0; 
  @JsonProperty() count: number = 0;
}