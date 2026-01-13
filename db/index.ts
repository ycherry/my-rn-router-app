import { getGithubEnv } from '@/lib/github-env'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { resolve } from 'node:path'
import { Pool } from 'pg'

import * as schema from './schema'

// Load environment variables from the correct .env file
config({ path: resolve(process.cwd(), '.env') })

const env = getGithubEnv()

// Validate that DATABASE_URL is set
if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const pool = new Pool({
  connectionString: env.DATABASE_URL,
})

export const db = drizzle(pool, { schema })

// Export DAOs
export { battlesDao } from './models/daos/battles'
export { implementationsDao } from './models/daos/implementations'
export { usersDao } from './models/daos/users'
export { userSessionsDao } from './models/daos/userSessions'
export { userTokensDao } from './models/daos/userTokens'

