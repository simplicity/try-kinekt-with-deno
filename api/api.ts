import { createNotFoundEndpoint, createServer } from "npm:kinekt";
import { getUser } from "./endpoints/users/getUser.ts";

const serve = createServer({});

serve(createNotFoundEndpoint(), getUser);
