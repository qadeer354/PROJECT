import { GeneralizedUser } from "./generalized.user.model";

export class Chat{
  id: string | undefined;
  firstUserId : string | undefined;
  secondUserId : string | undefined;
  users: GeneralizedUser[]  = [];
  messageId: string[] = [];
}
