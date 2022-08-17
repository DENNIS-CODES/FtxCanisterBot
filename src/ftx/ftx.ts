import {
  WebsocketClient,
  RestClient,
  OrderType,
  OrderSide,
} from "ftx-api";
import { sendMessage } from "../bot/bot";
import { CONFIG } from "../config/config";
import { Order } from "../types";
import { sleep } from "../utils/";

export class ftxCanisterWrapper {
  _ws: WebsocketClient;
  _client: RestClient;

  private _closePrice: number = 0;

  // Connecting to FTX using ftx api RestClient or Websockets

  constructor(key: string, secret: string, subAccountName?: string) {
    this._ws = new WebsocketClient({
      key,
      secret,
    });

    this._client = new RestClient(key, secret, {
      subAccountName,
    });
  }

  _MARKET = "BTC-PERP";


  setClosePrice(price: number) {
    this._closePrice = price;
    console.log(this._closePrice);
    console.log("Bot Stopping and restarting");
    process.exit(1);
  }

  getPrice = async (symbol: string): Promise<number | null> => {
    symbol = this.getMarket(symbol);
    const { success, result } = await this._client.getFuture(symbol);

    if (success) {
      return result.last;
    }
    return null;
  };

  // get client Position

  _getPositions = async () => {
    return this._client.getPositions;
  };

  _placeOrder = async (_params: {
    side: OrderSide;
    size: number;
    market: string;
    price: number;
    type: OrderType;
    chase: {
      by_amount: number;
    };
  }): Promise<Order | null> => {
    let _future: any = await this._client.getFuture(_params.market);
    let future: any = _future?.result?.last;
    _params.market = this.getMarket(_params.market);
    _params.size = _params.size / future;
    _params.price =
      _params.side === "buy"
        ? future - _params.chase.by_amount
        : future + _params.chase.by_amount;
    const { success, result } = await this._client.placeOrder(_params);
    if (success) {
      sendMessage(`placed ${result.side} order, ${result.id}`);
      return {
        id: result.id,
        market: result.market,
        side: result.side,
        type: result.type,
        price: result.price,
        quantity: result.size,
        createdAt: result.createdAt,
      };
    }
    return null;
  };

  chaseOrder = async (
    _params: {
      id: string;
      market: string;
      side: "buy" | "sell";
      trailByBPS?: number;
      maxRetries?: number;
    },
    _extraParams?: {
      tgId?: number;
    }
  ): Promise<void> => {
    let count = 0;
    _params.market = this.getMarket(_params.market);

    let { id, market, side, trailByBPS, maxRetries } = _params;
    let { tgId } = _extraParams || {};

    const MAX_RETRIES = maxRetries ?? CONFIG.MAX_RETRIES;
    while (true) {
      await sleep(10000);
      console.log(`---`.repeat(10));
      let msg = `Chasing order ${id}`;
      sendMessage(msg);

      let price = await this.getPrice(market);
      if (price === null) {
        msg = `Could not get price for ${market}`;
        sendMessage(msg);
        console.error(msg);
        return;
      }

      // trailByBPS is the value to trail by in percent
      trailByBPS = trailByBPS ?? 0.01;
      price = side === "buy" ? price - trailByBPS : price + trailByBPS;

      try {
        const { success, result, error } = await this._client.modifyOrder({
          orderId: id.toString(),
          price,
        });
        if (success) {
          id = result.id;
          market = result.market;
          side = result.side;
          continue;
        } else {
          console.error(`Could not chase order ${id}`, error);
        }
      } catch (error: any) {
        let rsn = error?.body?.error;
        console.log("Error:", rsn);
        if (rsn?.includes("Must modify either price or size")) {
          continue;
        }
        if (rsn?.includes("Size too small for provide")) {
          msg = `Order is now in position ✔️`;
          sendMessage(msg);

          break;
        }
      }

      count++;
      console.log(`Retry count: ${count}`);
      if (count > MAX_RETRIES) {
        msg = `Max retries\\/chases reached for order ${id}. Chased order ${count} times.`;
        await this._client.cancelOrder(id);
        sendMessage(msg);
        break;
      }

      // Wait for a bit before trying again
      await sleep(1000);
    }
  };

  placeConditionalOrders = async (params: {
    side: OrderSide;
    size: number;
    trigger: number;
    type: OrderType;
    price: number;
    market: string;
    chase: {
      by_amount: number;
      howLongInSec: number;
      chaseTimeLimit: number;
      sleep: number;
    };
  }): Promise<Order | null> => {
    let _future: any = await this._client.getFuture(params.market);
    let future: any = _future?.result?.last;
    await sleep(250);
    console.log("Live Price:", future);
    while (future) {
      if (this._closePrice === 50) {
        process.exit(1);
      }
      let newPrice: any = await this._client.getFuture(params.market);
      let price: any = newPrice?.result.last;
      try {
        params.size = params.size / price;
        await sleep(2500);
        console.log("Bot Started and live price is:", price);

        let calc1Above = future - newPrice;
        let calc2Above = newPrice - future;

        console.log("calc1Above:", calc1Above);
        console.log("calc2Above:", calc2Above);

        params.price =
          params.side === "buy"
            ? price - params.chase?.by_amount
            : price + params.chase?.by_amount;
        if (calc1Above > 0 || calc2Above > 0) {
          if (calc1Above <= params.trigger && calc2Above <= params.trigger) {
            let message = "";
            message = `Target Price is Hit: \`${newPrice}\`, Target Diffrence: ${
              calc1Above || calc2Above
            }`;
            sendMessage(message);
            const { success, result } = await this._client.placeOrder(params);
            if (success) {
              sendMessage(`Order placed: ${result.id}`);
              return {
                id: result.id,
                market: result.market,
                side: result.side,
                type: result.type,
                price: result.price,
                quantity: result.size,
                createdAt: result.createdAt,
              };
            }
          }
        }
      } catch (error) {
        console.log("Errors", error);
      }
      break;
    }
    return null;
  };

  getMarket = (symbol: string) => {
    symbol = symbol.toUpperCase();
    if (symbol.endsWith("-PERP")) {
    } else if (symbol.endsWith("PERP")) {
      symbol = symbol.replace("PERP", "-PERP");
    } else if (symbol.endsWith("-USDT")) {
      symbol = symbol.replace("-USDT", "-PERP");
    } else if (symbol.endsWith("USDT")) {
      symbol = symbol.replace("USDT", "-PERP");
    }
    return symbol;
  };

  _cancelAllOrders = async (params: { market: string }) => {
    try {
      await this._client.cancelAllOrders(params).then(async (result: any) => {
        if (result.success == "true") {
          let message = `Orders queued for cancelation`;

          console.log(message);

          sendMessage(message);
        } else {
          console.log("Error", result);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
}