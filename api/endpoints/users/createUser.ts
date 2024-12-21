import { z } from "zod";
import { db } from "../../../db/db.ts";
import { users } from "../../../db/schema.ts";
import { pipeline } from "../../pipeline.ts";

type User = typeof users.$inferInsert;

async function insertUser(user: User) {
  return db
    .insert(users)
    .values(user)
    .returning()
    .then((result) => result.at(0)!)
    .catch(() => null);
}

export const createUser = pipeline.createEndpoint(
  "POST /users",

  {
    body: z.object({ name: z.string(), email: z.string().email() }),
    response: {
      200: z.custom<User>(),
      409: z.custom<{ message: string }>(),
    },
  },

  async ({ body }) => {
    const user = await insertUser(body);

    if (user === null) {
      return {
        statusCode: 409,
        body: { message: `User with email '${body.email}' already exists.` },
      };
    }

    return {
      statusCode: 200,
      body: user,
    };
  }
);
