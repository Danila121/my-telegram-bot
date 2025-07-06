const mysql = require('mysql2');
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'ChatBotTests',
  password: '',
});

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
      "/start - приветствие бота",
      "/randomItem - получить случайный предмет из базы данных",
      "/deleteItem <id> - удалить предмет из базы данных по id",
      "/getItemByID <id> - получить предмет по id из базы данных"
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

  //Команды для работы с базой данных
  bot.onText(/\/randomItem/, (msg) => {
    const chatId = msg.chat.id;
    connection.query('SELECT * FROM Items ORDER BY RAND() LIMIT 1', (err, results) => {
        if (err || results.length === 0) {
          bot.sendMessage(chatId, 'Ошибка при получении случайного предмета (Его нет)');
        } else {
          const item = results[0];
          bot.sendMessage(chatId, `(${item.id}) - ${item.name}: ${item.desc}`);
        }
      }
    );
  });

  bot.onText(/\/deleteItem(?:\s+(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const itemId = match[1];

    if (!itemId) {
      return bot.sendMessage(chatId, 'Ошибка: укажите правильный ID. Пример: /deleteItem 5');
    }

    connection.query('DELETE FROM Items WHERE id = ?', [itemId], (err, result) => {
      if (err) {
        return bot.sendMessage(chatId, 'Ошибка при удалении.');
      }
      if (result.affectedRows === 0) {
        return bot.sendMessage(chatId, 'Ошибка: такого предмета нет.');
      }
      bot.sendMessage(chatId, `Предмет с ID ${itemId} удалён.`);
    });
  });

  bot.onText(/\/getItemByID (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const itemId = match[1];
    connection.query('SELECT * FROM Items WHERE id = ?',[itemId],(err, results) => {
        if (err || results.length === 0) {
          bot.sendMessage(chatId, 'Предмет не найден.');
        } else {
          const item = results[0];
          bot.sendMessage(chatId, `(${item.id}) - ${item.name}: ${item.desc}`);
        }
      }
    );
  });
}

module.exports = startBot;