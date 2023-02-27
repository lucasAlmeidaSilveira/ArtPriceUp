import { click } from './tools.js';

async function updateValues(page, value) {
  const inputValue = 'input#ProdutoEstoqueValorVenda';
  const checkBoxPromo = '#ProdutoEstoquePromocao';
  const inputPercentual = '#ProdutoEstoquePercentualPromocao';
  const inputInitPromo = '#ProdutoEstoquePromocaoDataInicio';
  const inputEndPromo = '#ProdutoEstoquePromocaoDataFim';
  const btnSubmit = 'button.btn.btn-icon.btn-submit';

  await page.$eval(inputValue, input => (input.value = value));

  // Clica no botão de Promoção
  await click(checkBoxPromo, page);

  // Atualiza valor de desconto para 30
  await page.$eval(inputPercentual, input => (input.value = '30'));

  // Atualiza valor data de inicio da promoção
  await page.$eval(inputInitPromo, input => (input.value = '23/02/2023'));

  // Atualiza valor data de fim da promoção
  await page.$eval(inputEndPromo, input => (input.value = '01/01/2024'));

  // Clica no botão Salvar variação
  await click(btnSubmit, page);
}

async function updateValueDefault(page) {
  const checkBoxPromo = '#ProdutoEstoquePromocao';
  const inputPercentual = '#ProdutoEstoquePercentualPromocao';
  const inputInitPromo = '#ProdutoEstoquePromocaoDataInicio';
  const inputEndPromo = '#ProdutoEstoquePromocaoDataFim';

  // Clica no botão de Promoção
  const isChecked = await page.$eval(checkBoxPromo, input => input.checked);
  isChecked ? '' : await click(checkBoxPromo, page)

  // Atualiza valor de desconto para 30
  await page.focus(inputPercentual);
  await page.keyboard.type('30');
  await page.keyboard.press('Tab');
  
  // Bug
  await page.focus(inputPercentual);
  await page.keyboard.type('25');
  await page.keyboard.press('Tab');
  await page.focus(inputPercentual);
  await page.keyboard.type('30');
  await page.keyboard.press('Tab');

  // Atualiza valor data de inicio da promoção
  await page.$eval(inputInitPromo, input => (input.value = '23/02/2023'));

  // Atualiza valor data de fim da promoção
  await page.$eval(inputEndPromo, input => (input.value = '01/01/2024'));
}

async function updateInputValue(page) {
  const inputSize =
    'div#ProdutoEstoqueCombinacaoAtributo2Id_chosen > a.chosen-single span';
  const inputMaterial =
    'div#ProdutoEstoqueCombinacaoAtributo1Id_chosen > a.chosen-single span';
  const inputValue = 'input#ProdutoEstoqueValorVenda';

  const btnSubmit = 'button.btn.btn-icon.btn-submit';
  const sizeP = '30cm x 45cm';
  const sizeM = '40cm x 60cm';
  const sizeG = '60cm x 90cm';

  // Espera até que o seletor da tag <a> esteja disponível na página
  await page.waitForSelector(inputSize);

  // Recupera valor do span de tamanho do produto
  const valueInputSize = await page.$eval(inputSize, span =>
    span.textContent.trim(),
  );
  const valueInputMaterial = await page.$eval(inputMaterial, span =>
    span.textContent.trim(),
  );

  if (valueInputMaterial === 'Quadro com vidro') {
    if (valueInputSize === sizeP) {
      await page.$eval(inputValue, input => (input.value = '227,14'));
      await updateValueDefault(page);

      // Clica no botão Salvar variação

      await click(btnSubmit, page);
    } else if (valueInputSize === sizeM) {
      await page.$eval(inputValue, input => (input.value = '355,71'));
      await updateValueDefault(page);

      // Clica no botão Salvar variação
      await click(btnSubmit, page);
    } else if (valueInputSize === sizeG) {
      await page.$eval(inputValue, input => (input.value = '727,14'));
      await updateValueDefault(page);

      // Clica no botão Salvar variação
      await click(btnSubmit, page);
    }
  }

  if (valueInputMaterial === 'Quadro sem vidro') {
    if (valueInputSize === sizeP) {
      await page.$eval(inputValue, input => (input.value = '155,71'));
      await updateValueDefault(page);

      // Clica no botão Salvar variação

      await click(btnSubmit, page);
    } else if (valueInputSize === sizeM) {
      await page.$eval(inputValue, input => (input.value = '255,71'));
      await updateValueDefault(page);

      // Clica no botão Salvar variação
      await click(btnSubmit, page);
    } else if (valueInputSize === sizeG) {
      await page.$eval(inputValue, input => (input.value = '512,86'));
      await updateValueDefault(page);

      // Clica no botão Salvar variação
      await click(btnSubmit, page);
    }
  }
}

export { updateInputValue };