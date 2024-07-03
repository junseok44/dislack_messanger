// src/types/express/index.d.ts

import { User } from "../../controllers/auth";

declare global {
  namespace Express {
    interface Request {
      user?: User; // 여기서 User 타입을 정의
    }
  }
}
