from aiogram.types import InlineKeyboardMarkup,InlineKeyboardButton
from aiogram.types.web_app_info import WebAppInfo

markup = InlineKeyboardMarkup()
keyboard = InlineKeyboardButton('Web app',web_app=WebAppInfo(url='https://hungnguyenkl.github.io/'))
markup.add(keyboard)

inlineMarkup = InlineKeyboardMarkup()
buy = InlineKeyboardButton('Pay with discount',pay=True)
cancel = InlineKeyboardButton('Cancel pay',callback_data='pay||cancel')
back = InlineKeyboardButton('Back to Pokemon NFT', web_app=WebAppInfo(url='https://hungnguyenkl.github.io/'))

inlineMarkup.add(buy).add(cancel).add(back)
