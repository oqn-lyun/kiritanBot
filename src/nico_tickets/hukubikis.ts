import got from "got";
import { HukubikiResponse, isHukubikiResponse } from "./types";
import { sendMessage } from "../bot/kiritanbot";
import { getCookie } from "./utils";

const getNicoHukubiki = async (): Promise<HukubikiResponse | undefined> => {
  const url =
    "https://api.nicoad.nicovideo.jp/v1/conductors?conductorFrameId=6";
  const cookie = await getCookie();
  const res = await got(url, { headers: { cookie } });
  const body = JSON.parse(res.body) as unknown;
  if (!isHukubikiResponse(body)) {
    return undefined;
  }
  return body;
};

const makeMessage = (hukubikis?: HukubikiResponse): string => {
  if (!hukubikis) {
    return "おにいたま 福引の取得に失敗しました セッションが切れてるかもしれません";
  }
  if (hukubikis.data.conductors.length === 0) {
    return "おにいたま 福引はありませんよ";
  }
  let message = "おにいたま 福引もありますよ いっしょに引きましょう";
  for (const hukubiki of hukubikis.data.conductors) {
    const { text, url } = hukubiki;
    message += `\n・${(text ?? "これ何の福引でしょう？").replace(
      "\n",
      ""
    )} <${url}|URL>`;
  }
  return message;
};

const main = async (): Promise<void> => {
  const tickets = await getNicoHukubiki();
  if (tickets) {
    await sendMessage(makeMessage(tickets));
  }
};

main().catch((error) => {
  console.log(error);
});
