require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

function startBot(){
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const bot = new TelegramBot(token, { polling: true });
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привет, октагон!');
  });
}

module.exports = startBot;