
const TelegramBot = require('node-telegram-bot-api');
const request = require('request');

const token = '775825380:AAHQ05AYqX4bKoQBAnr2VjuYqHw4SKZEn40';

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/curse/, (msg, match) => {
  

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
        bot.sendMessage(id, md, {parse_mode:'Markdown'})
    })
})