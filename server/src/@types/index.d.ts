// src/types/express/index.d.ts

import { User } from "./user";

declare global {
  namespace Express {
    interface Request {
      user: User | null;
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      JWT_ACCESS_SECRET: string;
      JWT_REFRESH_SECRET: string;
      NODE_ENV: "development" | "production";
      SERVER_PORT: number;
      STRIPE_SECRET_KEY: string;
    }
  }
}
