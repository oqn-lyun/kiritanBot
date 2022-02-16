import { TypeOf, literal, number, type, array, string, union } from "io-ts";
import * as t from "io-ts";

const ticketsResponse = type({
  meta: type({ status: literal(200) }),
  data: type({
    tickets: array(
      type({
        ticketName: string,
        expiredAt: number,
      })
    ),
  }),
});

export type TicketsResponse = TypeOf<typeof ticketsResponse>;

export const isTicketResponse = (json: unknown): json is TicketsResponse =>
  ticketsResponse.is(json);

export const hukubikiResponse = type({
  meta: type({ status: literal(200) }),
  data: type({
    conductors: array(
      type({
        text: union([string, t.null]),
        url: string,
      })
    ),
  }),
});

export type HukubikiResponse = TypeOf<typeof hukubikiResponse>;

export const isHukubikiResponse = (json: unknown): json is HukubikiResponse =>
  hukubikiResponse.is(json);
