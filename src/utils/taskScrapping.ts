import puppeteer from "puppeteer-extra";
import axios from "axios";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

export const getAirtableSessionCookies = async (oauthToken: string, baseId: string) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage()

    await page.goto(`https://airtable.com/login`, { waitUntil: "networkidle2" });
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'mohammed@naji.dev');
    await page.click('button[type="submit"]');
    await page.waitForSelector('input[type="password"]');
    await page.type('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();


    const cookies = await browser.cookies();
    await page.screenshot({
        fullPage: true,
        path: "screenshot.png",

    })
    await browser.close();
    const sessionSig = cookies.find((cookie) => cookie.name === '__Host-airtable-session.sig')?.value;
    const airtableSession = cookies.find((cookie) => cookie.name === '__Host-airtable-session')?.value;

    return { sessionSig, airtableSession }
}

export const getRevisionHistory = async (baseId: string, tableId: string, ticketId: string, sessionSig: string, airtableSession: string) => {
    try {


        const { data } = await axios.get(`https://airtable.com/v0.3/row/${ticketId}/readRowActivitiesAndComments`,
            {
                headers: {
                    "Cookie": `__Host-airtable-session.sig=${sessionSig}; __Host-airtable-session=${airtableSession}`,
                    'x-airtable-application-id': baseId,
                    'x-requested-with': 'XMLHttpRequest',
                    'x-time-zone': 'America/New_York',
                    'accept': 'application/json, text/javascript, */*; q=0.01',
                    'accept-language': 'en-US,en;q=0.9,ar;q=0.8'

                },
            })

        return data
    }
    catch (error: any) {
        throw new Error(error.message);
    }

}
