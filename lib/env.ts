import { z } from "zod";

const envSchema = z.object({
  VITE_APP_URL: z.string().optional(),
  VITE_PAYPAL_CLIENT_ID: z.string().optional(),
  VITE_PAYPAL_SANDBOX_CLIENT_ID: z.string().optional(),
  VITE_REFINE_API_URL: z.string(),
});

export const getEnv = () => {
  const { error, data } = envSchema.safeParse(process.env);
  if (error) {
    throw new Error(
      `Env not valid. Message is: ${JSON.stringify(error.issues, null, 2)}`
    );
  }

  return data;
};
