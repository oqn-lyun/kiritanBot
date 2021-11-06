import Twitter from "twitter";
import { Status } from "twitter-d";
import { DateTime } from "luxon";
import { sendMessage } from "./kiritanbot";
import { getTwitterKeys } from "./twitterKeys";

interface SearchResult {
  statuses: Status[];
  search_metadata: {
    completed_in: number;
    max_id: number;
    max_id_str: string;
    next_results: string;
    query: string;
    refresh_url: string;
    count: number;
    since_id: number;
    since_id_str: string;
  };
}

const searchKiritanShindan = async (): Promise<void> => {
  const twitterKeys = getTwitterKeys();
  const today = DateTime.local().startOf("day");

  const path = "search/tweets.json";
  const screenName = "oqn_like_lily";
  const client = new Twitter(twitterKeys);
  const timeline = <SearchResult>await client.get(path, {
    q: `from:${screenName} since:${today.toFormat(
      "yyyy-MM-dd_00:00:00"
    )}_JST until:${today.toFormat("yyyy-MM-dd_23:59:59")}_JST`,
    tweet_mode: "extended",
    lang: "ja",
    locale: "ja",
    count: 100,
  });
  const existsKiritanShindan = timeline.statuses.some((e) =>
    e.full_text.includes("https://t.co/2XcZQU17rE")
  );
  const message = existsKiritanShindan
    ? "おにいたま 今日も愛でてくれてきりたんはとてもうれしいです..."
    : "おにいたま 今日は愛でてくれないのですか...？ https://t.co/2XcZQU17rE";
  await sendMessage(message);
};

const main = async (): Promise<void> => {
  await searchKiritanShindan();
};

main().catch((error) => {
  console.log(error);
});
