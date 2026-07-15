import { Role } from "../../../generated/prisma/enums";

export interface IRegisterUserPayload {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
  role: Role;
}
