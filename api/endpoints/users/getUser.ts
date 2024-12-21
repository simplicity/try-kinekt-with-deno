import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../../db/db.ts";
import { users } from "../../../db/schema.ts";
import { pipeline } from "../../pipeline.ts";

type User = typeof users.$inferSelect;

async function selectUser(id: number) {
  return db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .then((result) => result.at(0));
}

export const getUser = pipeline.createEndpoint(
  "GET /users/:id",

  {
    params: z.object({ id: z.coerce.number() }),
    response: {
      200: z.custom<User>(),
      404: z.custom<{ message: string }>(),
    },
  },

  async ({ params }) => {
    const user = await selectUser(params.id);

    if (user === undefined) {
      return {
        statusCode: 404,
        body: { message: "User not found" },
      };
    }

    return {
      statusCode: 200,
      body: user,
    };
  }
);
