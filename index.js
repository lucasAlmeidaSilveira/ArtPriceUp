import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import { initPuppeteer } from './src/config.js';
import { updateInputValue } from './src/controllers/updatePrice.js';
import { click, waitForURL, getNumberEnd } from './src/controllers/tools.js';
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
  const URLpainel = process.env.URLPAINEL;
  const URLproducts = process.env.URLPRODUTOS;
  const btnVariacoes = 'a#ui-id-6';
  let contador = 1;
  let numberFrames;
  let skuProduct;

  await page.goto(URLpainel);

  (await page.url()) !== URLpainel ? await login(page) : '';

  try {
    while (true) {
      await waitForURL(page, 'edit');

      // Recuperando a quantidade de quadros pelo SKU
      skuProduct = await page.$eval('#ProdutoSku' || '.stock-sku', input => input.value);
      numberFrames = getNumberEnd(skuProduct);

      // Tempo de atraso para carregamento da página
      await new Promise(resolve => setTimeout(resolve, 2000));
      //Clique na tab variações
      await page.click(btnVariacoes);

      while (contador <= 18) {
        let btnEdit = `table.tabela-variacoes tr:nth-child(${contador}) a[title="Editar"]`;
        await click(btnEdit, page);
        await updateInputValue(page, numberFrames);

        contador += 1;
      }
      contador = 1;
      await page.goto(URLproducts);
    }
  } catch (err) {
    const error =
      err.message === 'No element found for selector: a#ui-id-6'
        ? 'Excesso de requisições'
        : err.message;
    console.log(error);
    await browser.close();
  }
})();
