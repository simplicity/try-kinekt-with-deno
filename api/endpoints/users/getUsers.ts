import { z } from "zod";
import { db } from "../../../db/db.ts";
import { users } from "../../../db/schema.ts";
import { pipeline } from "../../pipeline.ts";

type User = typeof users.$inferSelect;

async function selectUsers() {
  return db.select().from(users);
}

export const getUsers = pipeline.createEndpoint(
  "GET /users",

  {
    response: {
      200: z.custom<Array<User>>(),
    },
  },

  async () => {
    const users = await selectUsers();

    return {
      statusCode: 200,
      body: users,
    };
  }
);
