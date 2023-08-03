const telegram = window.Telegram.WebApp
const telegramData = telegram.initDataUnsafe
if (Object.keys(telegramData).length === 0 || typeof telegramData.user === 'undefined') {
    
} else {
    telegram.expand()
    // document.querySelector("#logbox").innerText = JSON.stringify(telegram, null, 4)
}
const themeParams = telegram.themeParams
const mainButton = telegram.MainButton