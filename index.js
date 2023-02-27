import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import { initPuppeteer } from './src/config.js';
import { updateInputValue } from './src/controllers/updatePrice.js';
import { click } from './src/controllers/tools.js';
dotenv.config();

async function login(page) {
  /* Dados de acesso */
  await page.type('#user', process.env.USER);
  await page.type('#senha', process.env.PASS);
  /* Dados de acesso */

  await page.click('.form-field > #do-login');

  await page.waitForNavigation();
}

(async () => {
  const { page, browser } = await initPuppeteer(puppeteer);
  const URLpage = 'https://www.outletdosquadros.com.br/painel/catalogo/produtos/edit/701' 
  const btnVariacoes = 'a#ui-id-6'

  await page.goto('https://www.outletdosquadros.com.br/painel');

  (await page.url()) !== 'https://www.outletdosquadros.com.br/painel'
    ? await login(page)
    : '';

  await page.goto(URLpage);

  //Clique na tab variações
  await page.click(btnVariacoes);

  let contador = 1;
  while (contador <= 18) {
    let element = `table.tabela-variacoes tr:nth-child(${contador}) a[title="Editar"]`;
    await click(element, page);
    await updateInputValue(page);

    contador += 1;
  }

  await browser.close();
})();
