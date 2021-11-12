import { sendMessage } from "../bot/kiritanbot";
import { wmoEntries } from "./open-meteo-types";
import { getOpenMeteoObject } from "./open-meteo";
import { DateTime } from "luxon";

interface WeatherData {
  date: string;
  max_temp: number;
  min_temp: number;
  weather: string;
}

const makeMessage = (weatherData: WeatherData[]): string => {
  const weatherString = weatherData
    .map(
      (e) =>
        `${e.date} 天気：${e.weather} 最高気温：${e.max_temp} 最低気温：${e.min_temp}`
    )
    .join("\n");
  weatherData;
  return `おにいたまー 天気予報ですよー 雨降りそうなときはちゃんと傘持ってくださいよー\n${weatherString}`;
};

const getWeatherData = async (): Promise<WeatherData[]> => {
  const openMeteoObject = await getOpenMeteoObject();
  return openMeteoObject.daily.time
    .map((time, i) => ({
      date: DateTime.fromFormat(time, "yyyy-MM-dd").toFormat("MM月dd日"),
      max_temp: openMeteoObject.daily.temperature_2m_max[i],
      min_temp: openMeteoObject.daily.temperature_2m_min[i],
      weather: wmoEntries[openMeteoObject.daily.weathercode[i]],
    }))
    .filter((e) => e.date && e.max_temp && e.min_temp && e.weather);
};

const main = async (): Promise<void> => {
  const weatherData = await getWeatherData();
  const message = makeMessage(weatherData);
  await sendMessage(message);
};

main().catch((error) => {
  console.log(error);
});
