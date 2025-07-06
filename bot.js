require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

function startBot(){
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const bot = new TelegramBot(token, { polling: true });
  //Команды бота
  bot.onText(/\/start/, (msg)=>{
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привет, октагон!');
  });
  
  bot.onText(/\/help/, (msg)=>{
    const chatId = msg.chat.id;
    const lines = [
      "Доступные команды:",
      "/help - список команд",
      "/site - ссылка на сайт Октагона",
      "/creator - информация о создателе",
      "/start - приветствие бота"
    ];
    const text = lines.join('\n');
    bot.sendMessage(chatId, text);
  });

  bot.onText(/\/site/, (msg=>{
    const chatId = msg.chat.id;
    const octagonUrl = 'https://octagon-students.ru/';
    bot.sendMessage(chatId, octagonUrl);
  }))

  bot.onText(/\/creator/, (msg=>{
    const chatId = msg.chat.id;
    const creatorInfo = 'Danila Kabanov';
    bot.sendMessage(chatId, creatorInfo);
  }))
}

module.exports = startBot;