import { RequestUser } from "./requestuser";

declare global {
  namespace Express {
    interface Request {
      user: RequestUser
    }
  }
}
