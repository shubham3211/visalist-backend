const puppeteer = require('puppeteer');
const countryList = require('./country.json');

(async () => {
  const browser = await puppeteer.launch();
  let cl = Object.keys(countryList);
  for(let i=0;i<cl.length;i++){
    const page = await browser.newPage();
    await page.goto(`https://visalist.io/${cl[i].toLocaleLowerCase()}/all-visas`);
    await autoScroll(page);
    let countries = await page.$$(".flex.xs12 div[tabindex='0'] .v-responsive__content");
    for(let j=0;j<countries.length;j++){
      try{
        let countryDetails = await countries[j].$$("div[tabindex='-1']");
        if(!countryDetails[0] || !countryDetails[1]){
          return;
        }
        let visaDetail = (await (await countryDetails[0].getProperty('textContent')).jsonValue());
        let countryDetail = (await (await countryDetails[1].getProperty('textContent')).jsonValue());
        visaDetail = (visaDetail.split("\n"));
        visaDetail = visaDetail.map((visa) => visa.trim()).filter((visa) => visa)
        visaDetail[0]=visaDetail[0].split(" ").slice(0, 2).join(" ");
  
        countryDetail = countryDetail.trim();
        countryDetail = countryDetail.trim().split(" ");
        countryDetail = countryDetail.map((detail) => {
          if(detail){
            if(detail.codePointAt(0).toString(16).startsWith("1f")){
              return '|';
            }
          }
          return detail;
        });
        countryDetail.shift();
        countryDetail = countryDetail.join(" ");
        countryDetail = countryDetail.split("|");
        let countryName = visaDetail[0].split(" ")[0];
        let unlocode = visaDetail[0].split(" ")[1];
        unlocode = unlocode.split("");
        unlocode.shift();
        unlocode.pop();
        unlocode = unlocode.join("");
        let visaType = visaDetail[1];
        let capital = countryDetail[0].trim();
        let continentLocation = countryDetail[1].trim();
        let continent = countryDetail[2].trim();
        let devlopment = countryDetail[3].trim();
        let population = countryDetail[4].trim().split(" ")[0].trim();
        let currency = countryDetail[5].trim().split(",")[0].trim();
        let language = countryDetail[6].trim().split(" ")[0].trim();
        console.log(({capital, continentLocation, continent, devlopment, population, currency, language, unlocode, countryName, visaType}));
      }catch(err){
        console.log('err', err)
      }
    }
    await page.close();
  }
  await browser.close();
})();

async function autoScroll(page){
  await page.evaluate(async () => {
    return await new Promise((resolve, reject) => {
      let totalHeight = 0;
      let distance = 100;
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight+=distance;
        if(totalHeight>=scrollHeight){
          clearInterval(timer);
          resolve();
        }
      }, 100);
    })
  })
}
