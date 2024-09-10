import { EndpointItem } from "../services/endpoint-resolve.service";

export interface EndpointNode {
    parent: EndpointNode | null;
    item: EndpointItem;
}