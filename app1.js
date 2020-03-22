const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  let pages = [];
  const page = await browser.newPage();
  await page.goto('https://visalist.io/');
  pages.push(page);
  await page.setViewport({
    width: 1200,
    height: 800
  })
  await autoScroll(page);
  await page.click("#input-90");
  let countryObj = {};
  setTimeout(async() => {
    let countries = await getCountries(page);
    countries = " "+countries;
    countries = countries.split(")");
    countries.pop();
    countries = countries.map((country) => {
      return country.split(" ")[2];
    })
    
    for(let i=0;i<countries.length;i++){
      const page = await browser.newPage();
      await page.goto(`https://visalist.io/${countries[i].toLocaleLowerCase()}/all-visas`);
      if(await page.$('img[src="/img/error.gif"]')){
      }else{
        countryObj[countries[i]]=1;
      }
      await page.close()
    }

    fs.writeFile("./country.json", JSON.stringify(countryObj), (err) => {
      console.log('err', err);
    })
    page.close();
  }, 1000)

  // await browser.close();
})();

async function getCountries(page) {
  await page.evaluate(async() => {
    return await new Promise((resolve, reject) => {
      let lastHeight = 0;
      let container = document.querySelector('.v-menu__content.theme--light');
      let timer = setInterval(() => {
        let scrollHeight = container.scrollHeight;
        container.scrollTop = scrollHeight;
        if(lastHeight==scrollHeight){
          clearInterval(timer);
          resolve();
        }else{
          lastHeight=scrollHeight;
        }
      }, 1000);
    })
  })
  return await page.evaluate(async () => {
    return await new Promise((resolve, reject) => {
      let text = document.querySelector("div[role='listbox']").textContent;
      resolve(text);
    })
  })
}

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
