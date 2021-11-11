import {
  type,
  string,
  number,
  array,
  TypeOf,
  keyof,
  union,
  literal,
} from "io-ts";

export const wmoStrings = [
  "晴天",
  "晴れ",
  "曇り",
  "曇り",
  "霧",
  "霧",
  "霧雨",
  "霧雨",
  "霧雨",
  "霧雨",
  "霧雨",
  "雨",
  "雨",
  "雨",
  "雨雨",
  "雪",
  "雪",
  "雪",
  "雪",
  "雪",
  "にわか雨",
  "にわか雨",
  "にわか雨",
  "雪",
  "雪",
  "雷雨",
  "雹",
  "雹・雷雨",
] as const;

const wmoNumbers = [
  literal(0),
  literal(1),
  literal(2),
  literal(3),
  literal(45),
  literal(48),
  literal(51),
  literal(53),
  literal(55),
  literal(56),
  literal(57),
  literal(61),
  literal(63),
  literal(65),
  literal(66),
  literal(67),
  literal(71),
  literal(73),
  literal(75),
  literal(77),
  literal(80),
  literal(81),
  literal(82),
  literal(85),
  literal(86),
  literal(95),
  literal(96),
  literal(99),
] as const;

const openMeteoObject = type({
  daily: type({
    time: array(string),
    temperature_2m_max: array(number),
    temperature_2m_min: array(number),
    weathercode: array(union([...wmoNumbers])),
  }),
});

export type OpenMeteoObject = TypeOf<typeof openMeteoObject>;

export const isOpenMeteoObject = (json: unknown): json is OpenMeteoObject =>
  openMeteoObject.is(json);

export const wmoEntries = Object.fromEntries(
  wmoNumbers.map((e, i) => [e.value, wmoStrings[i]])
);
