import { click } from './tools.js';

const selectInputValue = 'input#ProdutoEstoqueValorVenda';
const selectBtnSubmit = 'button.btn.btn-icon.btn-submit';
const selectInputInitPromo = '#ProdutoEstoquePromocaoDataInicio';
const selectInputEndPromo = '#ProdutoEstoquePromocaoDataFim';
const selectResultPercentual = '#ProdutoEstoqueValorPromocao'
const selectInputPercentual = '#ProdutoEstoquePercentualPromocao';

async function solutionBug(page){
    const resultPercentual = await page.$eval(selectResultPercentual, input => input.value);
    while (resultPercentual === '0,00' || resultPercentual.length >= 7){
      await page.focus(selectInputPercentual);
      await page.keyboard.type('25');
      await page.keyboard.press('Tab');
      await page.focus(selectInputPercentual);
      await page.keyboard.type('30');
      await page.keyboard.press('Tab');
    }
}

async function updateValueDefault(page, checkBoxPromo) {
  // Clica no botão de Promoção
  await click(checkBoxPromo, page);

  // Atualiza valor de desconto para 30
  await page.focus(selectInputPercentual);
  await page.keyboard.type('30');
  await page.keyboard.press('Tab');

  // Atualiza valor data de inicio da promoção
  await page.$eval(selectInputInitPromo, input => (input.value = '23/02/2023'));

  // Atualiza valor data de fim da promoção
  await page.$eval(selectInputEndPromo, input => (input.value = '01/01/2024'));
}

async function updateInputValue(page) {
  await page.waitForSelector('#ProdutoEstoquePromocao');
  const checkBoxPromo = '#ProdutoEstoquePromocao';
  // Realiza a verificação do check box da promoção
  const isChecked = await page.$eval(checkBoxPromo, input => input.checked);
  if (isChecked !== true) {
    // Recupera o valor do input do preço
    const value = await page.$eval(selectInputValue, input => input.value);
    // Realiza a conta da valor maior com 30% off
    const newValue = (parseFloat(value) / 0.7).toFixed(2).toString().replace(".", ",");
    // Faz a atribuição do novo valor no input
    await page.$eval(
      selectInputValue,
      (input, valor) => (input.value = valor),
      newValue,
    );
    // Realiza a configuração da promoção
    await updateValueDefault(page, checkBoxPromo);
  }

  await solutionBug(page)

  // Salva as configurações
  await click(selectBtnSubmit, page);
}

export { updateInputValue };
