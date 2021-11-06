import { User, FullUser } from "twitter-d";

export function isFullUser(user: User): user is FullUser {
  return "screen_name" in user;
}
