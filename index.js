import puppeteer from 'puppeteer';
import { initPuppeteer } from './config.js';

async function login(page){
  /* Dados de acesso */
  await page.type('#user', 'ecom@artepropria.com');
  await page.type('#senha', 'Arte1259');
  /* Dados de acesso */

  await page.click('.form-field > #do-login');

  await page.waitForNavigation();
}

(async () => {
  const page = await initPuppeteer(puppeteer);

  await page.goto(
    'https://www.outletdosquadros.com.br/painel/login?id=MWQ3bTZnOThxYnVmdXZxNmdycTQ4YmtjYjQ%3D',
  );

  page.url() !== 'https://www.outletdosquadros.com.br/painel' ? await login(page) : ''

  await page.goto('https://www.outletdosquadros.com.br/painel/catalogo/produtos/index')

  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();
