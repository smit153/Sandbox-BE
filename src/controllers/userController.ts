import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/users";
import { UserType } from "types/types";

const signup = async (
  _parent: unknown,
  { name, email, password }: { name: string; email: string; password: string }
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  const token = jwt.sign({ userId: user._id }, "your_secret_key");
  return { token, user };
};

const login = async (
  _parent: unknown,
  { email, password }: { email: string; password: string }
) => {
  const user: UserType|null = await User.findOne({ email });

  let passwordMatch;
  if (!user) {
    throw new Error("Invalid login credentials");
  } else {
    passwordMatch = bcrypt.compare(password, user?.password);
  }
  if (!passwordMatch) {
    throw new Error("Invalid login credentials");
  }

  const token = jwt.sign({ userId: user._id }, "your_secret_key");
  return { token, user };
};

const validateToken = async (
  _parent: unknown,
  { token }: { token: string }
) => {
  try {
    const decodedToken: JwtPayload = jwt.verify(token, "your_secret_key") as JwtPayload;

    const user: UserType | null = await User.findById(decodedToken.userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export { signup, login, validateToken };
