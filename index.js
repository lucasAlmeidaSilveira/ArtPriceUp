import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import { initPuppeteer } from './config.js';
import { updateInputValue } from './src/controllers/updatePrice.js';
import { click } from './src/controllers/tools.js'
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
  const { page } = await initPuppeteer(puppeteer);

  await page.goto('https://www.outletdosquadros.com.br/painel');

  (await page.url()) !== 'https://www.outletdosquadros.com.br/painel'
    ? await login(page)
    : '';

  await page.goto(
    'https://www.outletdosquadros.com.br/painel/catalogo/produtos/edit/618',
  );

  //Clique na tab variações
  await page.click('a#ui-id-6');

  const btn = '[title="Editar"]';

  await click(btn, page);

  updateInputValue(page);

  // await browser.close();
})();
