import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as events from './events';

const sql = neon("postgresql://admin_owner:npg_6BWen7OyLgic@ep-raspy-flower-a5xqftxd-pooler.us-east-2.aws.neon.tech/admin?sslmode=require");
export const db7 = drizzle(sql, { schema: events });

