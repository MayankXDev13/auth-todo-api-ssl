import jwt, { SignOptions } from "jsonwebtoken";

export function signToken(payload: object): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN ||
      "24h") as SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}
