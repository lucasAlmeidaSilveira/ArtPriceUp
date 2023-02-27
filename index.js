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

async function click(btn, page) {
  await page.waitForSelector(btn);
  await page.click(btn);
}

async function updateInputValue(page) {
  const inputSize =
    'div#ProdutoEstoqueCombinacaoAtributo2Id_chosen > a.chosen-single span';
  const expectedText = '30cm x 45cm';
  const inputValue = 'input#ProdutoEstoqueValorVenda';
  const checkBoxPromo = '#ProdutoEstoquePromocao';
  const inputPercentual = '#ProdutoEstoquePercentualPromocao';
  const inputInitPromo = '#ProdutoEstoquePromocaoDataInicio';
  const inputEndPromo = '#ProdutoEstoquePromocaoDataFim';
  const btnSubmit = 'button.btn.btn-icon.btn-submit';

  // Espera até que o seletor da tag <a> esteja disponível na página
  await page.waitForSelector(inputSize);

  // Recupera valor do span de tamanho do produto
  const spanText = await page.$eval(inputSize, span => span.textContent.trim());

  // Atualiza valores
  if (spanText === expectedText) {
    await page.$eval(inputValue, input => (input.value = '227,14'));

    // Clica no botão de Promoção
    await click(checkBoxPromo, page);

    // Atualiza valor de desconto para 30
    await page.$eval(inputPercentual, input => (input.value = '30'));

    // Atualiza valor data de inicio da promoção
    await page.$eval(inputInitPromo, input => (input.value = '23/02/2023'));

    // Atualiza valor data de fim da promoção
    await page.$eval(inputEndPromo, input => (input.value = '01/01/2024'));

    // Clica no botão Salvar variação
    click(btnSubmit, page);
  }
}

(async () => {
  const { page, browser } = await initPuppeteer(puppeteer);

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
