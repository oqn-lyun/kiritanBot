import { promises as fs } from "fs";

export const getCookie = async (): Promise<string> => {
  return await fs.readFile("nico_cookie", "utf-8");
};
