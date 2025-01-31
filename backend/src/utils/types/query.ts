import { OrderItem, WhereOptions } from "sequelize";

export interface GetAllQueryParams<T> {
  filters?: WhereOptions<T>;
  sortOptions?: OrderItem[];
  offset?: number;
  limit?: number;
}