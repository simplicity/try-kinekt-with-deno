import { createNotFoundEndpoint, createServer } from "kinekt";
import { createUser } from "./endpoints/users/createUser.ts";
import { getUser } from "./endpoints/users/getUser.ts";
import { getUsers } from "./endpoints/users/getUsers.ts";

const serve = createServer();

serve(createNotFoundEndpoint(), getUser, getUsers, createUser);
