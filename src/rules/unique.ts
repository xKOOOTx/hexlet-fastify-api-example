import { eq } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import type { DrizzleDB } from "../types/index.ts";

type UniqueOptions = {
  table: PgTable;
  field: string;
};

export default function unique(db: DrizzleDB, options: UniqueOptions) {
  return async (value: unknown) => {
    const column = (options.table as unknown as Record<string, never>)[options.field];
    const [row] = await db.select().from(options.table).where(eq(column, value));

    return !row;
  };
}