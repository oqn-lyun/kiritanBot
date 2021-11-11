import got from "got";
import { stringifyUrl } from "query-string";
import { OpenMeteoObject, isOpenMeteoObject } from "./open-meteo-types";
export const getOpenMeteoObject = async (): Promise<OpenMeteoObject> => {
  const url = "https://api.open-meteo.com/v1/forecast";
  const query = {
    latitude: 34.4111,
    longitude: 135.3112,
    hourly: "temperature_2m",
    daily: "weathercode,temperature_2m_max,temperature_2m_min",
    timezone: "Asia/Tokyo",
  };

  const res = await got(stringifyUrl({ url, query }, { encode: false }));
  const resbody = JSON.parse(res.body) as unknown;
  if (!isOpenMeteoObject(resbody)) {
    throw new Error("invalid response");
  }
  return resbody;
};
