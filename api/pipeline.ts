import {
  authenticate,
  AuthenticateCallbackResult,
  BasePipelineContext,
  checkAcceptHeader,
  cors,
  createPipeline,
  createValidatedEndpointFactory,
  deserialize,
  finalize,
  handleValidationErrors,
  logger,
  serialize,
  ValidationErrors,
  withValidation,
} from "npm:kinekt";

const defaultValidationErrorHandler = (validationErrors: ValidationErrors) => ({
  statusCode: 400 as const,
  body: validationErrors,
});

export type TestSession = { user: { email: string } };

async function getSession<In extends BasePipelineContext>(
  context: In
): Promise<AuthenticateCallbackResult<TestSession>> {
  const authorization = context.request.getHeader("authorization");

  return authorization === null
    ? { type: "unset" }
    : { type: "set", session: { user: { email: atob(authorization) } } };
}

export const pipeline = createValidatedEndpointFactory(
  createPipeline(
    cors({ origins: "*" }),
    authenticate(getSession),
    checkAcceptHeader(),
    deserialize(),
    withValidation()
  ).split(
    handleValidationErrors(defaultValidationErrorHandler),
    serialize(),
    finalize(),
    logger()
  )
);
