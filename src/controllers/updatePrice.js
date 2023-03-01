import { click } from './tools.js';

async function updateValueDefault(page) {
  const checkBoxPromo = '#ProdutoEstoquePromocao';
  const inputPercentual = '#ProdutoEstoquePercentualPromocao';
  const inputInitPromo = '#ProdutoEstoquePromocaoDataInicio';
  const inputEndPromo = '#ProdutoEstoquePromocaoDataFim';

  // Clica no botão de Promoção
  const isChecked = await page.$eval(checkBoxPromo, input => input.checked);
  isChecked ? '' : await click(checkBoxPromo, page);

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

async function updateInputValue(page, numberFrames) {
  const inputSize =
    'div#ProdutoEstoqueCombinacaoAtributo2Id_chosen > a.chosen-single span';
  const inputMaterial =
    'div#ProdutoEstoqueCombinacaoAtributo1Id_chosen > a.chosen-single span';
  const inputValue = 'input#ProdutoEstoqueValorVenda';

  const btnSubmit = 'button.btn.btn-icon.btn-submit';

  // Dados dos quadros
  const sizeP = '30cm x 45cm';
  const sizeM = '40cm x 60cm';
  const sizeG = '60cm x 90cm';
  const frameValues = {
    1: {
      'Quadro com vidro': {
        [sizeP]: '112,85',
        [sizeM]: '184,29',
        [sizeG]: '384,28',
      },
      'Quadro sem vidro': {
        [sizeP]: '84,29',
        [sizeM]: '141,43',
        [sizeG]: '270,00',
      },
    },
    2: {
      'Quadro com vidro': {
        [sizeP]: '227,14',
        [sizeM]: '355,71',
        [sizeG]: '727,14',
      },
      'Quadro sem vidro': {
        [sizeP]: '155,71',
        [sizeM]: '255,71',
        [sizeG]: '512,86',
      },
    },
    3: {
      'Quadro com vidro': {
        [sizeP]: '320,00',
        [sizeM]: '499,00',
        [sizeG]: '1041,45',
      },
      'Quadro sem vidro': {
        [sizeP]: '235,72',
        [sizeM]: '355,72',
        [sizeG]: '712,86',
      },
    },
  };

  // Espera até que o seletor da tag <a> esteja disponível na página
  await page.waitForSelector(inputSize);

  // Recupera valor do span de tamanho do produto
  const valueInputSize = await page.$eval(inputSize, span =>
    span.textContent.trim(),
  );
  const valueInputMaterial = await page.$eval(inputMaterial, span =>
    span.textContent.trim(),
  );

  const frameValue =
    frameValues[numberFrames][valueInputMaterial][valueInputSize];
  await page.$eval(
    inputValue,
    (input, value) => (input.value = value),
    frameValue,
  );
  await updateValueDefault(page);
  await click(btnSubmit, page);
}

export { updateInputValue };
