import * as z from "zod";
import { zUserCreateDto } from "../types/handlers/zod.gen.ts";

class UserValidator {
  static validateCreate(data: unknown) {
    const schema = zUserCreateDto.extend({
      email: z.string().toLowerCase(),
    });

    return schema.parseAsync(data);
  }
}

export default UserValidator;