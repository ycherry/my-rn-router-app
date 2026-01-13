import { z } from "zod/v4";

const envSchema = z.object({
  DATABASE_URL: z.string()
});

export const getGithubEnv = () => {
  const { error, data } = envSchema.safeParse(process.env);
  if (error) {
    throw new Error(`Server env not valid. Message is: ${JSON.stringify(error.issues, null, 2)}`);
  }

  return data;
};