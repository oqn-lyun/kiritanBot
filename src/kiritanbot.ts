import got from "got";

const endpoint = process.env.ENDPOINT;
const id = process.env.ID;

export const sendMessage = async (message: string): Promise<void> => {
  if (!endpoint || !id) {
    console.log("endpoint、idがありません");
    return;
  }
  const params = {
    text: `<${id}>${message}`,
  };
  await got.post(endpoint, {
    json: params,
  });
};
