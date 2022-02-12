import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { ftxCanisterWrapper } from "./ftx/ftx";
import { bot, sendMessage } from "./bot/bot";
import { CONFIG } from "./config/config";

const start = async () => {
  console.log(`...`.repeat(3));
  console.log(`Firing up🚀🚀🚀`);
  console.log(`...`.repeat(3));
  try {
    console.log("Connecting to Telegram bot...\n---");
    await bot
      .launch()
      .then((_result) => {
        console.log("Telegram Connected🦾🦾");

        sendMessage(
          `Bot starting at ${new Date()
            .toString()
            .replaceAll("(", "\\(")
            .replaceAll(")", "\\)")}...`
        );
      })
      .catch((error) => {
        console.log("Telegram error😪:", JSON.parse(JSON.stringify(error)));
      });
  } catch (error) {}
};
start();

const cors = require("cors");

const Main = async () => {
  const PORT = 6060;
  const app = express();

  app.use(express());
  app.use(cors());
  app.use(
    bodyParser.json({
      type: ["application/json", "text/plain"],
    })
  );
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  const subAccountName = "Reserves";

  app.post(
    "/speedymanbot/api/v1/orders/cannister",
    async (req: Request, res: Response) => {
      const {
        side,
        quantity,
        symbol,
        price,
        type,
        numOfOrders,
        chase,
        market,
        trailBy,
        target,
        botNumber,
        cancelPrice,
        stopPrice,
      } = req.body;

      try {
        let ftxWrapper;
        if (botNumber == 2) {
          if (numOfOrders == 13) {
            // First two orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            await ftxWrapper._placeLimitOrder(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 14) {
            // LossProtection Orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._lossProtection(
              side,
              quantity,
              trailBy,
              type,
              target,
              chase
            );
          } else if (numOfOrders == 15) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._minProfit(side, quantity, trailBy, type, target, chase);
          } else if (numOfOrders == 16) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._exitProfit(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 17) {
            // First two orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            await ftxWrapper._placeLimitOrder(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 18) {
            // LossProtection Orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._lossProtection(
              side,
              quantity,
              trailBy,
              type,
              target,
              chase
            );
          } else if (numOfOrders == 19) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._minProfit(side, quantity, trailBy, type, target, chase);
            console.log(cancelPrice);
          } else if (numOfOrders == 20) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._exitProfit(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 21) {
            // First two orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._placeLimitOrder(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 22) {
            // LossProtection Orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._lossProtection(
              side,
              quantity,
              trailBy,
              type,
              target,
              chase
            );
          } else if (numOfOrders == 23) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._minProfit(side, quantity, trailBy, type, target, chase);
          } else if (numOfOrders == 24) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._exitProfit(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 25) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._minProfit(side, quantity, trailBy, type, target, chase);
          } else if (numOfOrders == 26) {
            // LossProtection Orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._lossProtection(
              side,
              quantity,
              trailBy,
              type,
              target,
              chase
            );
          }
        }
      } catch (error) {
        console.error(`Error:`, error);
        res.status(200).json({
          status: "failed",
          error,
        });
      }
    }
  );

  app.post(
    "/speedymanbot/api/v1/orders/cannister",
    async (req: Request, res: Response) => {
      const {
        side,
        quantity,
        symbol,
        price,
        type,
        numOfOrders,
        chase,
        market,
        trailBy,
        target,
        botNumber,
        cancelPrice,
        stopPrice,
      } = req.body;

      try {
        let ftxWrapper;
        if (botNumber == 1) {
          if (numOfOrders == 1) {
            // First two orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            await ftxWrapper._placeLimitOrder(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 2) {
            // LossProtection Orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._lossProtection(
              side,
              quantity,
              trailBy,
              type,
              target,
              chase
            );
          } else if (numOfOrders == 3) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._minProfit(side, quantity, trailBy, type, target, chase);
          } else if (numOfOrders == 4) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._exitProfit(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 5) {
            // First two orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            await ftxWrapper._placeLimitOrder(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 6) {
            // LossProtection Orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._lossProtection(
              side,
              quantity,
              trailBy,
              type,
              target,
              chase
            );
          } else if (numOfOrders == 7) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._minProfit(side, quantity, trailBy, type, target, chase);
          } else if (numOfOrders == 8) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._exitProfit(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 9) {
            // First two orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            await ftxWrapper._placeLimitOrder(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 10) {
            // LossProtection Orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._lossProtection(
              side,
              quantity,
              trailBy,
              type,
              target,
              chase
            );
            console.log(stopPrice);
          } else if (numOfOrders == 11) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._minProfit(side, quantity, trailBy, type, target, chase);
          } else if (numOfOrders == 12) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._exitProfit(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 25) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._minProfit(side, quantity, trailBy, type, target, chase);
          } else if (numOfOrders == 26) {
            // LossProtection Orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._lossProtection(
              side,
              quantity,
              trailBy,
              type,
              target,
              chase
            );
          }
        } else if (botNumber == 2) {
          if (numOfOrders == 13) {
            // First two orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            await ftxWrapper._placeLimitOrder(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 14) {
            // LossProtection Orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._lossProtection(
              side,
              quantity,
              trailBy,
              type,
              target,
              chase
            );
          } else if (numOfOrders == 15) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._minProfit(side, quantity, trailBy, type, target, chase);
          } else if (numOfOrders == 16) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._exitProfit(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 17) {
            // First two orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            await ftxWrapper._placeLimitOrder(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 18) {
            // LossProtection Orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._lossProtection(
              side,
              quantity,
              trailBy,
              type,
              target,
              chase
            );
          } else if (numOfOrders == 19) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._minProfit(side, quantity, trailBy, type, target, chase);
            console.log(cancelPrice);
          } else if (numOfOrders == 20) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._exitProfit(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 21) {
            // First two orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._placeLimitOrder(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 22) {
            // LossProtection Orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._lossProtection(
              side,
              quantity,
              trailBy,
              type,
              target,
              chase
            );
          } else if (numOfOrders == 23) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._minProfit(side, quantity, trailBy, type, target, chase);
          } else if (numOfOrders == 24) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._exitProfit(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 25) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._minProfit(side, quantity, trailBy, type, target, chase);
          } else if (numOfOrders == 26) {
            // LossProtection Orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._lossProtection(
              side,
              quantity,
              trailBy,
              type,
              target,
              chase
            );
          }
        } else if (botNumber == 3) {
          if (numOfOrders == 1 && numOfOrders == 13) {
            // First two orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._placeLimitOrder(
              side,
              price,
              quantity,
              market,
              symbol,
              type,
              chase
            );
            // First two orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._placeLimitOrder(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 2 && numOfOrders == 14) {
            // LossProtection Orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._lossProtection(
              side,
              quantity,
              trailBy,
              type,
              target,
              chase
            );
          } else if (numOfOrders == 3 && numOfOrders == 15) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._minProfit(side, quantity, trailBy, type, target, chase);
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._minProfit(side, quantity, trailBy, type, target, chase);
          } else if (numOfOrders == 4 && numOfOrders == 16) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._exitProfit(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
            // subaccount
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._exitProfit(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 5 && numOfOrders == 17) {
            // First two orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._placeLimitOrder(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );

            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._placeLimitOrder(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 6 && numOfOrders == 18) {
            // LossProtection Orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._lossProtection(
              side,
              quantity,
              trailBy,
              type,
              target,
              chase
            );
            // LossProtection Orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._lossProtection(
              side,
              quantity,
              trailBy,
              type,
              target,
              chase
            );
          } else if (numOfOrders == 7 && numOfOrders == 19) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._minProfit(side, quantity, trailBy, type, target, chase);
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._minProfit(side, quantity, trailBy, type, target, chase);
          } else if (numOfOrders == 8 && numOfOrders == 20) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._exitProfit(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );

            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._exitProfit(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 9 && numOfOrders == 21) {
            // First two orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._placeLimitOrder(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );

            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._placeLimitOrder(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          } else if (numOfOrders == 10 && numOfOrders == 22) {
            // LossProtection Orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._lossProtection(
              side,
              quantity,
              trailBy,
              type,
              target,
              chase
            );

            // LossProtection Orders
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._lossProtection(
              side,
              quantity,
              trailBy,
              type,
              target,
              chase
            );
          } else if (numOfOrders == 11 && numOfOrders == 23) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._minProfit(side, quantity, trailBy, type, target, chase);

            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._minProfit(side, quantity, trailBy, type, target, chase);
          } else if (numOfOrders == 12 && numOfOrders == 24) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            ftxWrapper._exitProfit(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );

            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.SUB_API_KEY,
              CONFIG.SUB_API_SECRET,
              subAccountName
            );
            ftxWrapper._exitProfit(
              side,
              quantity,
              market,
              price,
              symbol,
              type,
              chase
            );
          }
        }
        return res.status(200).json({
          status: "success",
          data: [],
        });
      } catch (error) {
        console.error(`Error:`, error);
        res.status(200).json({
          status: "failed",
          error,
        });
      }
    }
  );

  /**
   * Stop Bot
   */
  app.post(
    "/speedymanbot/api/v1/orders/stop",
    async (req: Request, res: Response) => {
      console.log("THE BODY");
      console.log(req.body);
      const { numOfOrders, botNumber, cancelPrice } = req.body;
      let ftxWrapper;
      if (botNumber == 1) {
        try {
          if (numOfOrders == 25) {
            ftxWrapper = new ftxCanisterWrapper(
              CONFIG.LIVE_API_KEY,
              CONFIG.LIVE_API_SECRET
            );
            res.status(200).json({
              status: "success",
              data: [],
            });
            ftxWrapper.setClosePrice(cancelPrice);
          }
          return res.status(200).json({
            status: "success",
            data: [],
          });
        } catch (error) {
          console.error(`Error:`, error);
          res.status(200).json({
            status: "failed",
            error,
          });
        }
      }
    }
  );

  /**
   *
   * Server Connection
   */
  app.get("/speedymanbot/ping", (req: any, res: any) => {
    return res.send({
      error: false,
      message: "server on Fire🔥🔥😉",
    });
  });
  app.listen(PORT, () => {
    console.log("Server Running on port: " + PORT);
  });
};

Main();
