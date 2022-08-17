require("dotenv").config();

if (!process.env.BOT_TOKEN && !process.env.DB_URL) {
  throw new Error(
    "BOT_TOKEN && LIVE_API_KEY && LIVE_API_SECRET Must be defined in your .env FILE"
  );
}
export const CONFIG = {
  SUB_API_KEY: process.env.SUB_API_KEY || "",
  SUB_API_SECRET: process.env.SUB_API_SECRET || "",
  SUB_ACCOUNT_NAME: process.env.subAccountName || "",
  LIVE_API_KEY: process.env.LIVE_API_KEY || "",
  LIVE_API_SECRET: process.env.LIVE_API_SECRET || "",

  /**
   * DB
   */
  DB_URL: process.env.DB_URL!,
  BOX_NUMBER: [2, 3, 6, 7, 8, 10, 11],
  BOX_NUMBER_ONE: [1, 5, 9],
  MAX_RETRIES: 90,
  /**
   * Telegram
   */
  BOT_TOKEN: process.env.BOT_TOKEN!,
  TELEGRAM_DELETE_MESSAGE_INTERVAL: 60000, // 60 seconds
  WHITELISTED_USERS: ["2060423170", "1195869296", "299108118"],
};
