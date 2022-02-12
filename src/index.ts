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
  /**
   * Place Orders On SubAccount
   */
  app.post(
    "/canisterbot/api/v1/orders/cannister",
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
   * Cancel Orders On Sub Account
   */
  app.post(
    "/canisterbot/api/v1/orders/cannister/cancel",
    async (req: Request, res: Response) => {
      const { symbol, botNumber, numOfOrders } = req.body;

      if (!symbol) {
        return res.status(200).json({
          status: "failed",
          error: "Please specify the symbol|asset to cancel orders",
        });
      }

      let ftxWrapper;
      try {
        if (botNumber == 2) {
          ftxWrapper = new ftxCanisterWrapper(
            CONFIG.LIVE_API_KEY,
            CONFIG.LIVE_API_SECRET,
            subAccountName
          );
          ftxWrapper._cancelAllOrders({
            market: symbol,
          });
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
    "/canisterbot/api/v1/orders/stop",
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
  app.get("/canisterbot/ping", (req: any, res: any) => {
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
