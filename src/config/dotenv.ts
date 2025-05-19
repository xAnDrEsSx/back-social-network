import * as dotenv from 'dotenv';
import { join } from 'path';

export function loadEnvVariables() {
  const envFilePath = join(
    process.cwd(),
    'environments',
    `.env.${process.env.SCOPE?.trim()}`,
  );
  dotenv.config({ path: envFilePath });
}
