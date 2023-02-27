import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import { initPuppeteer } from './config.js';
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
  const {page, browser} = await initPuppeteer(puppeteer);

  await page.goto(
    'https://www.outletdosquadros.com.br/painel/login?id=MWQ3bTZnOThxYnVmdXZxNmdycTQ4YmtjYjQ%3D',
  );

  page.url() !== 'https://www.outletdosquadros.com.br/painel'
    ? await login(page)
    : '';

  await page.goto(
    'https://www.outletdosquadros.com.br/painel/catalogo/produtos/index',
  );

  await browser.close();
})();
