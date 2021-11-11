import got from "got";

const endpoint = process.env.ENDPOINT;
const id = process.env.ID;

export const sendMessage = async (message: string): Promise<void> => {
  if (!endpoint || !id) {
    throw new Error("endpoint、idがありません");
  }
  const json = {
    text: `<${id}>${message}`,
  };
  await got.post(endpoint, {
    json,
  });
};
