import postgres from 'postgres'

export const sql = postgres({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '0'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
})
