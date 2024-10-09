import { CardViewable } from "./card.viewable.model"
import { ProductCategory } from "./product.category.model"

export interface Product extends CardViewable {
    description: string
    category: ProductCategory
}