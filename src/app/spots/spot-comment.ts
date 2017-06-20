import {IUser} from "../users/user";
export class ISpotComment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  replies_count: number;
  user: IUser;
  modified_replies: ISpotComment[];
  showing: boolean = false;
}
