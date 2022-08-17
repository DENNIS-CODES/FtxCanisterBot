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
const MongoClient = require("mongodb").MongoClient;

const Main = async () => {
  const PORT = 7070;
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
  const subAccountName = CONFIG.SUB_ACCOUNT_NAME;
  //Establish Connection to Mongo Db
  let url = CONFIG.DB_URL!;
  // Connect
  let client = await MongoClient.connect(url);
  let db = await client.db();
  /**
   * Place Orders On SubAccount 2
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
        trigger,
        target,
        chaseOnce,
        copyTrade,
        invertedOrder,
      } = req.body;

      db?.collection("daytraderprovs").insertOne({
        side,
        quantity,
        price,
        symbol,
        type,
        target,
        chase,
        chaseOnce,
        copyTrade,
        invertedOrder,
      });
      try {
        let ftxWrapper;
        if (CONFIG.BOX_NUMBER_ONE.includes(numOfOrders)) {
          // First two orders
          ftxWrapper = new ftxCanisterWrapper(
            CONFIG.SUB_API_KEY,
            CONFIG.SUB_API_SECRET,
            subAccountName
          );
          let orderPlaced: any = await ftxWrapper._placeOrder({
            side: side,
            size: quantity,
            price: price,
            market: symbol,
            type: type,
            chase: chase,
          });
          if (chaseOnce == "false") {
            await ftxWrapper.chaseOrder({
              id: orderPlaced.id,
              side: orderPlaced.side,
              market: orderPlaced.market,
              trailByBPS: chase.by_amount,
              maxRetries: chase.maxRetries,
            });
          }
          return res.status(200).json({
            status: "success",
            data: [],
          });
        } else if (CONFIG.BOX_NUMBER.includes(numOfOrders)) {
          // LossProtection Orders
          ftxWrapper = new ftxCanisterWrapper(
            CONFIG.SUB_API_KEY,
            CONFIG.SUB_API_SECRET,
            subAccountName
          );
          const orderPlaced: any = await ftxWrapper.placeConditionalOrders({
            side: side,
            size: quantity,
            type: type,
            price: target,
            chase: chase,
            market: symbol,
            trigger: trigger,
          });
          await ftxWrapper.chaseOrder({
            id: orderPlaced.id,
            side: orderPlaced.side,
            market: orderPlaced.market,
            trailByBPS: chase.trailByBPS,
            maxRetries: chase.howLongInSec,
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
   * Cancel Orders On Sub Account
   */
  app.post(
    "/canisterbot/api/v1/orders/cannister/cancel",
    async (req: Request, res: Response) => {
      const { symbol, copyTrade } = req.body;

      db?.collection("cancel_order").insertOne({
        symbol,
        copyTrade,
      });
      let ftxWrapper;
      try {
        ftxWrapper = new ftxCanisterWrapper(
          CONFIG.SUB_API_KEY,
          CONFIG.SUB_API_SECRET,
          subAccountName
        );
        ftxWrapper._cancelAllOrders({
          market: symbol,
        });
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
      try {
        if (numOfOrders == 25) {
          ftxWrapper = new ftxCanisterWrapper(
            CONFIG.SUB_API_KEY,
            CONFIG.SUB_API_SECRET,
            subAccountName
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
