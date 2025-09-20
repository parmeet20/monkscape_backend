import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  DATABASE_URL: process.env.DATABASE_URL as string,
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 8080,
  JWT_SECRET: process.env.JWT_SECRET as string,
  FRONTEND_URL: process.env.FRONTEND_URL as string,
};