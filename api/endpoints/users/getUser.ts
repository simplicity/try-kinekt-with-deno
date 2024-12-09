import { z } from "npm:zod";
import { pipeline } from "../../pipeline.ts";

type User = {
  email: string;
};

export const getUser = pipeline.createEndpoint(
  "GET /users/:id",

  {
    params: z.object({ id: z.coerce.number() }),
    response: {
      200: z.custom<User>(),
      404: z.custom<{ message: string }>(),
    },
  },

  async () => {
    const user: User = { email: "some@email.com" };

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
