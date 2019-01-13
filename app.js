const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const options = {
    webHook: {
      // Port to which you should bind is assigned to $PORT variable
      // See: https://devcenter.heroku.com/articles/dynos#local-environment-variables
      port: process.env.PORT
      // you do NOT need to set up certificates since Heroku provides
      // the SSL certs already (https://<app-name>.herokuapp.com)
      // Also no need to pass IP because on Heroku you need to bind to 0.0.0.0
    }
  };
  const url = process.env.APP_URL || 'https://dnagorabot.herokuapp.com:443';
const TOKEN = '775825380:AAFrwaRuD2YYTwUqzet80JRzJ2jOW8H_WR8';

const bot = new TelegramBot(TOKEN, options);
bot.setWebHook(`${url}/bot${TOKEN}`);

bot.onText(/\/valuta/, (msg, match) => {
  

  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Выберите валюту:',{
  reply_markup: {
      inline_keyboard: [
         [
             {
                 text : '€ EUR',
                 callback_data: 'EUR'
             },
             {
                text : '＄ USD',
                callback_data: 'USD'
            },
            {
                text : '₽ RUR',
                callback_data: 'RUR'
            }
         ]
        ]
    }
});
});

bot.on('callback_query' , query => {
    const id = query.message.chat.id;
    request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',function(error, response,body){
        const data =  JSON.parse(body);
        const result = data.filter(item => item.ccy === query.data)[0]
        const flag = {
            'EUR':'🇪🇺',
            'USD':'🇺🇸',
            'RUR':'🇷🇺',
            'UAH':'🇺🇦'
        }
        let md = `
            *${flag[result.ccy]} ${result.ccy} => ${result.base_ccy}${flag[result.base_ccy]}*
            Buy: _${result.buy}_
            Sale:_${result.sale}_
        
        `;
        bot.sendMessage(id, md, {parse_mode:'Markdown'});
    });
});
