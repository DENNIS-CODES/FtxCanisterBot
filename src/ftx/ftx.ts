import {
  WebsocketClient,
  RestClient,
  ConditionalOrderTypeNoUnderscore,
  OrderType,
  OrderSide,
} from "ftx-api";
import { sendMessage } from "../bot/bot";
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

  get ws() {
    return this._ws;
  }

  setClosePrice(price: number) {
    this._closePrice = price;
    console.log(this._closePrice);
    console.log("Bot Stopping and restarting");
    process.exit(1);
    // if (this._closePrice === 50) {
    //   console.log("Bot Stopping and restarting");

    // }
  }

  // get client Position

  _getPositions = async () => {
    return this._client.getPositions;
  };

  _placeLimitOrder = async (
    side: OrderSide,
    size: number,
    symbol: string,
    market: string,
    price: number,
    type: OrderType,
    chase: {
      by_amount: number;
      howLongInSec: number;
      chaseTimeLimit: number;
    }
  ) => {
    console.log("chase amount", chase.by_amount);
    let _future: any = await this._client.getFuture(this._MARKET);
    let future: any = _future?.result;
    console.log(future);

    if (_future.success) {
      try {
        let new_price;

        if (side.toLowerCase() == "sell") {
          new_price = future?.last + Math.abs(chase?.by_amount || 0);
        } else {
          new_price = future?.last - Math.abs(chase?.by_amount || 0);
        }
        await this._client
          .placeOrder({
            side,
            size: size / parseFloat(`${future?.last}`), // Converting size orders into USD
            market: this._MARKET,
            price: new_price,
            type: "limit",
          })
          .then(async (result: any) => {
            let message = "";

            if (result["success"]) {
              message = `Placed a new limit order with id: \`${result.result?.id}\``;
              sendMessage(message);
              console.log(message);
              let id = result["result"]["id"];
              let side = result["result"]["side"];
              let market = result["result"]["market"];
              let size = result["result"]["size"];
              let startTime = new Date().getTime();
              let new_price;
              let count = 1;

              while (chase) {
                message = `\`${count}:\` Chasing order \`${id}\`...`;
                console.log(message);
                sendMessage(message);

                count++;

                let _future: any = await this._client.getFuture(market);
                let price: any = _future?.result?.last;
                if (side.toLowerCase() == "sell") {
                  new_price = price + Math.abs(chase?.by_amount || 0);
                } else {
                  new_price = price - Math.abs(chase?.by_amount || 0);
                }
                let data;
                try {
                  data = await this._client.modifyOrder({
                    orderId: id,
                    price: new_price,
                  });
                } catch (error: any) {
                  let rsn = error?.body?.error;
                  console.log("Error:", rsn);
                  if (rsn?.includes("Must modify either price or size")) {
                    sendMessage(message);
                    continue;
                  }
                  if (rsn?.includes("Size too small for provide")) {
                    message = `Order is now in position`;
                    sendMessage(message);
                    break;
                  }
                }

                if (data?.success) {
                  id = data["result"]["id"];

                  side = data["result"]["side"];

                  message = `Success: modified order \`${id}\``;

                  sendMessage(message);
                } else {
                  message = `Error while modifying order: ${data?.error}`;

                  sendMessage(message);

                  console.log(message);

                  break;
                }
                console.log("modify:", data);
                let current = new Date().getTime();
                let diff = current - startTime;
                if (
                  chase.howLongInSec >= chase.chaseTimeLimit &&
                  diff >= chase.howLongInSec * 1_000
                ) {
                  // we go market
                  await this._client.placeOrder({
                    side,
                    size,
                    market,
                    price,
                    type: "market",
                  });

                  break;
                }
                if (
                  chase.howLongInSec <= chase.chaseTimeLimit &&
                  diff >= chase.howLongInSec * 1_000
                ) {
                  // we cancel order
                  await this._client.cancelOrder(id);

                  break;
                }
                //  modify at 3 seconds interval
                await sleep(7_000);
              }
            } else {
              console.log("Error", result);
            }
          })
          .catch((err: any) => {
            console.error(`Error:`, err);
          });
      } catch (error) {
        console.log("Errors", error);
      }
    }
    await sleep(250);
  };

  _lossProtection = async (
    side: OrderSide,
    size: number,
    trigger: number,
    type: OrderType,
    target: number,
    chase: {
      by_amount: number;
      howLongInSec: number;
      chaseTimeLimit: number;
    }
  ) => {
    let new_price;
    let pass = true;
    let newPrice = target;
    console.log("Trigger Price:", newPrice);
    console.log("chase amount", chase?.by_amount);
    let _future: any = await this._client.getFuture(this._MARKET);
    let future: any = _future?.result;
    await sleep(250);
    console.log("Live Price:", future.last);

    let futureLastPrice: any = future?.last;
    loop1: while (future?.last) {
      loop2: if (this._closePrice === 50) {
        console.log("BotStopped");
        pass = false;
        futureLastPrice = false;
        break loop1;
      }
      let _future: any = await this._client.getFuture(this._MARKET);
      let future: any = _future?.result;
      try {
        if (side == "sell") {
          new_price = future?.last + Math.abs(chase?.by_amount || 0);
        } else {
          new_price = future?.last - Math.abs(chase?.by_amount || 0);
        }
        await sleep(2500);
        console.log("Bot Started and live price is:", future?.last);
        console.log("target:", newPrice);

        let calc1Above = future?.last - newPrice;
        let calc2Above = newPrice - future?.last;

        console.log("calc1Above:", calc1Above);
        console.log("calc2Above:", calc2Above);

        let trigger = 10;
        if (calc1Above > 0 || calc2Above > 0) {
          if (calc1Above <= trigger && calc2Above <= trigger) {
            let message = "";
            message = `Target Price is Hit: \`${
              future.last
            }\`, Target Diffrence: ${calc1Above || calc2Above}`;
            sendMessage(message);
            console.log(message);

            await this._client
              .placeOrder({
                side,
                size: size / parseFloat(`${future?.last}`),
                market: this._MARKET,
                price: new_price,
                type: "limit",
              })
              .then(async (result: any) => {
                let message = "";
                if (result["success"]) {
                  message = `Placed a new limit order with id: \`${result.result?.id}\``;
                  sendMessage(message);
                  console.log(message);
                  let id = result["result"]["id"];
                  let side = result["result"]["side"];
                  let market = result["result"]["market"];
                  let size = result["result"]["size"];
                  let startTime = new Date().getTime();

                  let new_price;

                  let count = 1;
                  while (chase) {
                    message = `\`${count}:\` Chasing order \`${id}\`...`;
                    console.log(message);
                    sendMessage(message);
                    count++;

                    let _future: any = await this._client.getFuture(
                      this._MARKET
                    );

                    let price: any = _future?.result?.last;

                    if (side.toLowerCase() == "sell") {
                      new_price = price + Math.abs(chase.by_amount || 0);
                    } else {
                      new_price = price - Math.abs(chase.by_amount || 0);
                    }
                    let data;

                    try {
                      data = await this._client.modifyOrder({
                        orderId: id,
                        price: new_price,
                      });
                    } catch (error: any) {
                      let rsn = error?.body?.error;
                      console.log("Error:", rsn);

                      if (rsn?.includes("Must modify either price or size")) {
                        sendMessage(message);
                        continue;
                      }

                      if (rsn?.includes("Size too small for provide")) {
                        message = `Order is now in position`;
                        sendMessage(message);
                        break;
                      }
                    }

                    if (data?.success) {
                      id = data["result"]["id"];
                      side = data["result"]["side"];
                      message = `Success: modified order \`${id}\``;
                      sendMessage(message);
                    } else {
                      message = `Error while modifying order: ${data?.error}`;
                      sendMessage(message);
                      console.log(message);
                      break;
                    }
                    console.log("modify:", data);

                    let current = new Date().getTime();

                    let diff = current - startTime;

                    if (
                      chase.howLongInSec >= chase.chaseTimeLimit &&
                      diff >= chase.howLongInSec * 1_000
                    ) {
                      // we go market
                      await this._client.placeOrder({
                        side,
                        size,
                        market,
                        price,
                        type: "market",
                      });
                      break;
                    }
                    if (
                      chase.howLongInSec <= chase.chaseTimeLimit &&
                      diff >= chase.howLongInSec * 1_000
                    ) {
                      // we cancel order
                      await this._client.cancelOrder(id);
                      break;
                    }
                    //  modify at 3 seconds interval
                    await sleep(7_000);
                    process.exit(1);
                  }
                }
              })
              .catch((err: any) => {
                console.error(`Error:`, err);
              });
          }
        }
      } catch (error) {
        console.log("Errors", error);
      }
    }
  };
  _minProfit = async (
    side: OrderSide,
    size: number,
    trigger: number,
    type: OrderType,
    target: number,
    chase: {
      by_amount: number;
      howLongInSec: number;
      chaseTimeLimit: number;
    }
  ) => {
    let new_price;
    let pass = true;
    let newPrice = target;
    console.log("Trigger Price:", newPrice);
    console.log("chase amount", chase?.by_amount);
    let _future: any = await this._client.getFuture(this._MARKET);
    let future: any = _future?.result;
    await sleep(250);
    console.log("Live Price:", future.last);

    let futureLastPrice: any = future?.last;
    loop1: while (future?.last) {
      loop2: if (this._closePrice === 50) {
        console.log("BotStopped");
        pass = false;
        futureLastPrice = false;
        break loop1;
      }
      let _future: any = await this._client.getFuture(this._MARKET);
      let future: any = _future?.result;
      try {
        if (side == "sell") {
          new_price = future?.last + Math.abs(chase?.by_amount || 0);
        } else {
          new_price = future?.last - Math.abs(chase?.by_amount || 0);
        }
        await sleep(2500);
        console.log("Bot Started and live price is:", future?.last);
        console.log("target:", newPrice);

        let calc1Above = future?.last - newPrice;
        let calc2Above = newPrice - future?.last;

        console.log("calc1Above:", calc1Above);
        console.log("calc2Above:", calc2Above);

        let trigger = 10;
        if (calc1Above > 0 || calc2Above > 0) {
          if (calc1Above <= trigger && calc2Above <= trigger) {
            let message = "";
            message = `Target Price is Hit: \`${
              future.last
            }\`, Target Diffrence: ${calc1Above || calc2Above}`;
            sendMessage(message);
            console.log(message);

            await this._client
              .placeOrder({
                side,
                size: size / parseFloat(`${future?.last}`),
                market: this._MARKET,
                price: new_price,
                type: "limit",
              })
              .then(async (result: any) => {
                let message = "";
                if (result["success"]) {
                  message = `Placed a new limit order with id: \`${result.result?.id}\``;
                  sendMessage(message);
                  console.log(message);
                  let id = result["result"]["id"];
                  let side = result["result"]["side"];
                  let market = result["result"]["market"];
                  let size = result["result"]["size"];
                  let startTime = new Date().getTime();

                  let new_price;

                  let count = 1;
                  while (chase) {
                    message = `\`${count}:\` Chasing order \`${id}\`...`;
                    console.log(message);
                    sendMessage(message);
                    count++;

                    let _future: any = await this._client.getFuture(
                      this._MARKET
                    );

                    let price: any = _future?.result?.last;

                    if (side.toLowerCase() == "sell") {
                      new_price = price + Math.abs(chase.by_amount || 0);
                    } else {
                      new_price = price - Math.abs(chase.by_amount || 0);
                    }
                    let data;

                    try {
                      data = await this._client.modifyOrder({
                        orderId: id,
                        price: new_price,
                      });
                    } catch (error: any) {
                      let rsn = error?.body?.error;
                      console.log("Error:", rsn);

                      if (rsn?.includes("Must modify either price or size")) {
                        sendMessage(message);
                        continue;
                      }

                      if (rsn?.includes("Size too small for provide")) {
                        message = `Order is now in position`;
                        sendMessage(message);
                        break;
                      }
                    }

                    if (data?.success) {
                      id = data["result"]["id"];
                      side = data["result"]["side"];
                      message = `Success: modified order \`${id}\``;
                      sendMessage(message);
                    } else {
                      message = `Error while modifying order: ${data?.error}`;
                      sendMessage(message);
                      console.log(message);
                      break;
                    }
                    console.log("modify:", data);

                    let current = new Date().getTime();

                    let diff = current - startTime;

                    if (
                      chase.howLongInSec >= chase.chaseTimeLimit &&
                      diff >= chase.howLongInSec * 1_000
                    ) {
                      // we go market
                      await this._client.placeOrder({
                        side,
                        size,
                        market,
                        price,
                        type: "market",
                      });
                      break;
                    }
                    if (
                      chase.howLongInSec <= chase.chaseTimeLimit &&
                      diff >= chase.howLongInSec * 1_000
                    ) {
                      // we cancel order
                      await this._client.cancelOrder(id);
                      break;
                    }
                    //  modify at 3 seconds interval
                    await sleep(7_000);
                    process.exit(1);
                  }
                }
              })
              .catch((err: any) => {
                console.error(`Error:`, err);
              });
          }
        }
      } catch (error) {
        console.log("Errors", error);
      }
    }
  };

  _exitProfit = async (
    side: OrderSide,
    size: number,
    symbol: string,
    market: string,
    price: number,
    type: OrderType,
    chase: {
      by_amount: number;
      howLongInSec: number;
      chaseTimeLimit: number;
    }
  ) => {
    console.log("chase amount", chase?.by_amount);

    let _future: any = await this._client.getFuture(this._MARKET);

    let future: any = _future?.result;

    console.log(future);

    let new_price;

    try {
      if (side.toLowerCase() == "sell") {
        new_price = future?.last + Math.abs(chase?.by_amount || 0);
      } else {
        new_price = future?.last - Math.abs(chase?.by_amount || 0);
      }

      await this._client

        .placeOrder({
          side,

          size: size / parseFloat(`${future?.last}`), // Converting size orders into USD

          market: this._MARKET,

          price: new_price,

          type: "limit",
        })

        .then(async (result: any) => {
          let message = "";

          if (result["success"]) {
            message = `Placed a new limit order with id: \`${result.result?.id}\``;

            sendMessage(message);

            console.log(message);

            let id = result["result"]["id"];

            let side = result["result"]["side"];

            let market = result["result"]["market"];

            let size = result["result"]["size"];

            let startTime = new Date().getTime();

            let new_price;

            let count = 1;

            while (chase) {
              message = `\`${count}:\` Chasing order \`${id}\`...`;

              console.log(message);

              sendMessage(message);

              count++;

              let _future: any = await this._client.getFuture(this._MARKET);

              let price: any = _future?.result?.last;

              if (side.toLowerCase() == "sell") {
                new_price = price + Math.abs(chase.by_amount || 0);
              } else {
                new_price = price - Math.abs(chase.by_amount || 0);
              }

              let data;

              try {
                data = await this._client.modifyOrder({
                  orderId: id,

                  price: new_price,
                });
              } catch (error: any) {
                let rsn = error?.body?.error;

                console.log("Error:", rsn);

                if (rsn?.includes("Must modify either price or size")) {
                  sendMessage(message);

                  continue;
                }

                if (rsn?.includes("Size too small for provide")) {
                  message = `Order is now in position`;

                  sendMessage(message);

                  break;
                }
              }

              if (data?.success) {
                id = data["result"]["id"];

                side = data["result"]["side"];

                message = `Success: modified order \`${id}\``;

                sendMessage(message);
              } else {
                message = `Error while modifying order: ${data?.error}`;

                sendMessage(message);

                console.log(message);

                break;
              }

              console.log("modify:", data);

              let current = new Date().getTime();

              let diff = current - startTime;

              if (
                chase.howLongInSec >= chase.chaseTimeLimit &&
                diff >= chase.howLongInSec * 1_000
              ) {
                // we go market

                await this._client.placeOrder({
                  side,
                  size,
                  market,
                  price,
                  type: "market",
                });
                break;
              }
              if (
                chase.howLongInSec <= chase.chaseTimeLimit &&
                diff >= chase.howLongInSec * 1_000
              ) {
                // we cancel order
                await this._client.cancelOrder(id);
                break;
              }
              //  modify at 3 seconds interval
              await sleep(7_000);
            }
          }
        })

        .catch((err: any) => {
          console.error(`Error:`, err);
        });
    } catch (error) {
      console.log("Errors", error);
    }
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
