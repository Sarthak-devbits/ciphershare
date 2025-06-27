import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface MyJwtPayload extends JwtPayload {
  id: number;
  email: string;
}

export const authorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.access_token;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const data = jwt.verify(
      token,
      process.env.JWT_SECERT as string
    ) as MyJwtPayload;

    console.log(data)
    req.userId = parseInt(data.id.toString());
    req.email = data.email;
    next();
    return;
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
    return;
  }
};
