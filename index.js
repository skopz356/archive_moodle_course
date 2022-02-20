import * as firefox from 'selenium-webdriver/firefox.js'
import {Builder, until, By} from 'selenium-webdriver'
import scrape from 'website-scraper'

const pathToSave = '/home/tomas/test' // Složka do, které se to má uložit
const userAgent = 'Mozilla/5.0 (X11; Linux x86_64; rv:97.0) Gecko/20100101 Firefox/97.0'

let moodleUrl
let cookies

(async () => {
    const firefoxOptions = new firefox.Options()
    firefoxOptions.setPreference('general.useragent.override', userAgent)
    const args = process.argv.slice(2)

    //firefoxOptions.addArguments("-headless")

    const driver = new Builder().forBrowser('firefox').setFirefoxOptions(firefoxOptions).build()
    await driver.wait(until.elementLocated(By.className("usertext")))
    moodleUrl = await driver.getCurrentUrl()
    cookies = await driver.manage().getCookies()
    const cookieValue = cookies.find(cookie => {
        return cookie.name === 'MoodleSession'
    }).value

    const options = {
        urls: [...args],
        directory: pathToSave,
        request: {
            headers: {
                'User-Agent': userAgent,
                'Cookie': `MoodleSession=${cookieValue}`
            }
        }
    };

    scrape(options)
})();
