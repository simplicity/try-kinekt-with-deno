import { Command, InvalidArgumentError } from "@commander-js/extra-typings";
import { createUser } from "../api/endpoints/users/createUser.ts";
import { getUser } from "../api/endpoints/users/getUser.ts";
import { getUsers } from "../api/endpoints/users/getUsers.ts";
import { pipeline } from "../api/pipeline.ts";

pipeline.setGlobalClientParams({
  baseUrl: "http://localhost:3000",
  authorize: btoa("some-auth"),
});

const program = new Command();

// TODO use deno kv for key value store!
// https://deno.com/blog/build-cross-platform-cli

function intParser(value: string): number {
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError("Not a number.");
  }
  return parsedValue;
}

program
  .command("get-user")
  .description("Get a user by id")
  .requiredOption("--id <number>", "The user id to query by", intParser)
  .action(async (params) => {
    const result = await getUser({ params: { id: params.id } }).ok(200);

    console.log(result);
  });

program
  .command("get-users")
  .description("Get all users")
  .action(async () => {
    const result = await getUsers({}).ok(200);

    console.log(result);
  });

program
  .command("create-user")
  .description("Create a user")
  .requiredOption("--name <string>", "The user name")
  .requiredOption("--email <string>", "The user email")
  .action(async (params) => {
    const result = await createUser({ body: params }).ok(200);

    console.log(result);
  });

program.parse();
