import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {productType} from "@/sanity/schemaTypes/productType";
import {orderType} from "@/sanity/schemaTypes/orderType";
import {salesType} from "@/sanity/schemaTypes/salesType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, productType, orderType, salesType],
}
