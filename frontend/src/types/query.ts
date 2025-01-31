export type WhereConditions<T> = {
  [K in keyof T]?: T[K];
};

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export interface GetAllQueryParams<T> {
  filters?: WhereConditions<T>; // Аналог WhereOptions из Sequelize
  sortOptions?: [string, SortOrder][];
  offset?: number;
  limit?: number;
}

export interface QueryState<T> extends GetAllQueryParams<T> {}
