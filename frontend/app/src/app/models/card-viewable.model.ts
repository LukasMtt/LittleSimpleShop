import { Image } from "./image.model"

export interface CardViewable {
    id: number
    name: string
    images: Image[]
}