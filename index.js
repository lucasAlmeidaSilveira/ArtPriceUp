const puppeteer = require('puppeteer');

async function login(page){
  /* Dados de acesso */
  await page.type('#user', 'ecom@artepropria.com');
  await page.type('#senha', 'Arte1259');
  /* Dados de acesso */

  await page.click('.form-field > #do-login');

  await page.waitForNavigation();
}

(async () => {
  const browser = await puppeteer.launch({
    userDataDir: 'C:/Users/lucas/AppData/Local/Google/Chrome/User Data',
  });

  const page = await browser.newPage();
  await page.goto(
    'https://www.outletdosquadros.com.br/painel/login?id=MWQ3bTZnOThxYnVmdXZxNmdycTQ4YmtjYjQ%3D',
  );

  page.url() !== 'https://www.outletdosquadros.com.br/painel' ? await login(page) : ''

  console.log(page.url());

  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();
