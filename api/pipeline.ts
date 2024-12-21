import {
  AuthenticateCallbackResult,
  BasePipelineContext,
  simpleSetup,
} from "kinekt";

export type TestSession = { user: { email: string } };

async function getSession<In extends BasePipelineContext>(
  context: In
): Promise<AuthenticateCallbackResult<TestSession>> {
  const authorization = context.request.getHeader("authorization");

  return authorization === null
    ? { type: "unset" }
    : { type: "set", session: { user: { email: atob(authorization) } } };
}

export const pipeline = simpleSetup({ cors: { origins: "*" }, getSession });
