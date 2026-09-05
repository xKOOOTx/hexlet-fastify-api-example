import * as z from "zod";
import * as schemas from "../db/schema.ts";
import unique from "../rules/unique.ts";
import type { DrizzleDB } from "../types/index.ts";
import { zUserCreateDto } from "../types/handlers/zod.gen.ts";

class UserValidator {
  static validateCreate(db: DrizzleDB, data: unknown) {
    const schema = zUserCreateDto.extend({
      email: z
        .string()
        .toLowerCase()
        .refine(unique(db, { table: schemas.users, field: "email" }), {
          message: "email is already taken"
        }),
    });

    return schema.parseAsync(data);
  }
}

export default UserValidator;