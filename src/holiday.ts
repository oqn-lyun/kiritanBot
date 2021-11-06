import got from "got";
import { DateTime } from "luxon";
import { string } from "io-ts";
import { sendMessage } from "./kiritanbot";

interface Holiday {
  readonly days: number;
  readonly date: string;
  readonly name: string;
}

const searchNextHoliday = async (): Promise<Holiday | undefined> => {
  const url = "https://holidays-jp.github.io/api/v1/date.json";
  const res = await got(url);
  const holidays = Object.entries(JSON.parse(res.body));
  const today = DateTime.local().startOf("day");
  for (const holiday of holidays) {
    if (!string.is(holiday[1])) {
      continue;
    }
    const day = DateTime.fromFormat(holiday[0], "yyyy-MM-dd");
    const delta = day.diff(today, "days").days;
    if (delta >= 0) {
      return { days: delta, date: holiday[0], name: holiday[1] };
    }
  }
};

const makeMessage = (holiday: Holiday): string => {
  if (holiday.days === 0) {
    return `おにいたま おはようございます 今日は${holiday.name}(${holiday.date})ですよ ゲームしましょう`;
  } else {
    return `おにいたま おはようございます 次の祝日の${holiday.name}(${holiday.date})まで、あと${holiday.days}日ですよ`;
  }
};

const main = async (): Promise<void> => {
  const nextHoliday = await searchNextHoliday();
  if (nextHoliday) {
    await sendMessage(makeMessage(nextHoliday));
  }
};

main().catch((error) => {
  console.log(error);
});
