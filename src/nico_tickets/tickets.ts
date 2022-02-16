import got from "got";
import { TicketsResponse, isTicketResponse } from "./types";
import { DateTime } from "luxon";
import { sendMessage } from "../bot/kiritanbot";
import { getCookie } from "./utils";

const getNicoKokenTickets = async (): Promise<TicketsResponse | undefined> => {
  const url = "https://api.koken.nicovideo.jp/v1/tickets";
  const cookie = await getCookie();
  const res = await got(url, { headers: { cookie } });
  const body = JSON.parse(res.body) as unknown;
  if (!isTicketResponse(body)) {
    return undefined;
  }
  return body;
};

const makeMessage = (tickets?: TicketsResponse): string => {
  if (!tickets) {
    return "おにいたま チケットの取得に失敗しました セッションが切れてるかもしれません";
  }
  if (tickets.data.tickets.length === 0) {
    return "おにいたま チケットはありませんよ";
  }
  let message = "おにいたま チケットがありますよ 忘れずに使い切ってくださいね";
  for (const ticket of tickets.data.tickets) {
    const { ticketName, expiredAt } = ticket;
    const dulation = DateTime.fromSeconds(expiredAt)
      .endOf("day")
      .diff(DateTime.now().endOf("day"), "days").days;
    const expire = DateTime.fromSeconds(expiredAt).toFormat("yyyy年LL月dd日");
    if (dulation === 0 || dulation === 1) {
      message += `\n・${ticketName} ${dulation === 0 ? "今日" : "明日"}まで`;
    } else {
      message += `\n・${ticketName} あと${dulation}日  (有効期限${expire}まで)`;
    }
  }
  return message;
};

const main = async (): Promise<void> => {
  const tickets = await getNicoKokenTickets();
  if (tickets) {
    await sendMessage(makeMessage(tickets));
  }
};

main().catch((error) => {
  console.log(error);
});
