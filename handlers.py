from aiogram import Bot, Dispatcher, executor, types
from aiogram.types.message import ContentTypes
import logging
from config import TOKEN, PROVIDER_TOKEN
from keyboards import markup, inlineMarkup

logging.basicConfig(level=logging.INFO)

bot = Bot(token=TOKEN, parse_mode=types.ParseMode.HTML)
dp = Dispatcher(bot)

shipping_options = [
    types.ShippingOption(id='free', title='Global POST', prices=[
        types.LabeledPrice(label="in a 30 days to home", amount=0)
    ]),
    types.ShippingOption(id='premium', title='Delivers by courier', prices=[
        types.LabeledPrice(label="in a 3 days to home", amount=130 * 100)
    ]),
]


@dp.message_handler(commands=["info", "start"])
async def start(message: types.Message):
    print(f"start:{message}")
    full_name = f"{message.from_user.first_name} {message.from_user.last_name}"
    reply = f"Hello <b>{full_name}</b> 🖐, Welcome to Pokemon NFT!!"
    if message.text == "/start":
        reply += "\n<pre>You can buy only the most profitable NFT tokens from us.</pre>"
    await message.answer(reply, reply_markup=markup)


@dp.message_handler(commands=["testpay"])
async def info(message: types.Message):
    print(f"info:{message}")
    await bot.send_invoice(
        message.chat.id,
        title="POKEMON NFT TEST ORDER",
        description="order checkout from web app",
        provider_token="284685063:TEST:YjJmZTU0OWQ0YTE3",
        currency="USD",
        photo_url="https://i.pinimg.com/originals/ce/86/bf/ce86bfc1979af3ac87db7ab1f2dd07b2.jpg",
        photo_width=735,
        photo_height=490,
        is_flexible=True,
        max_tip_amount=10000 * 100,
        prices=[
            types.LabeledPrice(label="Product 1", amount=250 * 100),
            types.LabeledPrice(label="Product 2", amount=150 * 100)
        ],
        payload="testpay=1445",
        need_name=True,
        need_email=True,
        need_phone_number=True,
        need_shipping_address=True,
        reply_markup=inlineMarkup
    )


@dp.shipping_query_handler(lambda query: True)
async def shipping(shipping_query: types.ShippingQuery):
    print(f"shipping:{shipping_query}")
    if shipping_query.shipping_address.country_code in ["UZ", "CA", "US", "VN"]:
        await bot.answer_shipping_query(shipping_query.id, ok=True, shipping_options=shipping_options)
    else:
        error_message = "Oh, we're so sorry that we can't ship to your country. !"
        await bot.answer_shipping_query(shipping_query.id, ok=False, error_message=error_message)


@dp.pre_checkout_query_handler(lambda query: True)
async def checkout(pre_checkout_query: types.PreCheckoutQuery):
    print(f"checkout:{pre_checkout_query}")
    await bot.answer_pre_checkout_query(pre_checkout_query.id, ok=True)


@dp.message_handler(content_types=ContentTypes.SUCCESSFUL_PAYMENT)
async def success_payment(message: types.Message):
    print(f"success_payment:{message}")
    print("bor")
    await bot.send_message(chat_id=message.chat.id, text="Thank you for order !")


def main():
    executor.start_polling(dp, skip_updates=True)
