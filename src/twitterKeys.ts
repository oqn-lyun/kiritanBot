import { type, string, TypeOf } from "io-ts";

const keys = type({
  consumer_key: string,
  consumer_secret: string,
  access_token_key: string,
  access_token_secret: string,
});

type TwitterKeys = TypeOf<typeof keys>;

export const isTwitterKeys = (json: unknown): json is TwitterKeys =>
  keys.is(json);

const twitterKeys = {
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_KEY,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
};

export const getTwitterKeys = (): TwitterKeys => {
  if (isTwitterKeys(twitterKeys)) {
    return twitterKeys;
  } else {
    throw new Error("invalid keys");
  }
};
