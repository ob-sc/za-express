export interface SqlGenerator {
  select: (columns: string, table: string, ...rest: string[]) => string;
  selectAll: (table: string, ...rest: string[]) => string;
  insert: (table: string) => string;
  update: (table: string, ...rest: string[]) => string;
  delete: (table: string, ...rest: string[]) => string;
}
