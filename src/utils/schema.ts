import Joi from "joi";

// Define the environment variable schema
const envSchema = Joi.object({
  NEXT_PUBLIC_ENVIRONMENT: Joi.string()
    .required()
    .valid("Development", "Staging", "Production"),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: Joi.string().required(),
  NEXT_PUBLIC_BACKEND_BASE_URL: Joi.string().required(),
  NEXT_PUBLIC_CHECKOUT_DATA_EXPIRATION_DURATION_IN_MILLISECONDS:
    Joi.string().default(60 * 60 * 1000), // 1 hour in milliseconds
  NEXT_PUBLIC_USER_DATA_EXPIRATION_DURATION_IN_MILLISECONDS:
    Joi.string().default(60 * 60 * 1000), // 1 hour in milliseconds
  NEXT_PUBLIC_SKIP_OTP_VERIFICATION: Joi.boolean().default(false),
})
  .unknown() // This allows Joi to accept other environment variables if they exist
  .required();

export function validateEnv() {
  const { error } = envSchema.validate(process.env, {
    abortEarly: false, // Don't stop at the first error
    allowUnknown: false, // Allow unknown keys
  });

  if (error) {
    console.error("Environment variable validation errors:", error.details);
    process.exit(1); // Exit the app if validation fails
  }

  console.log("Environment variables validated successfully!");
}
