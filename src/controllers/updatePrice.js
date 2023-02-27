async function updateValues(page, value) {
  const inputValue = 'input#ProdutoEstoqueValorVenda';
  const checkBoxPromo = '#ProdutoEstoquePromocao';
  const inputPercentual = '#ProdutoEstoquePercentualPromocao';
  const inputInitPromo = '#ProdutoEstoquePromocaoDataInicio';
  const inputEndPromo = '#ProdutoEstoquePromocaoDataFim';
  const btnSubmit = 'button.btn.btn-icon.btn-submit';

  console.log(value)
  // await page.$eval(inputValue, input => (input.value = value));

  // // Clica no botão de Promoção
  // await click(checkBoxPromo, page);

  // // Atualiza valor de desconto para 30
  // await page.$eval(inputPercentual, input => (input.value = '30'));

  // // Atualiza valor data de inicio da promoção
  // await page.$eval(inputInitPromo, input => (input.value = '23/02/2023'));

  // // Atualiza valor data de fim da promoção
  // await page.$eval(inputEndPromo, input => (input.value = '01/01/2024'));

  // // Clica no botão Salvar variação
  // await click(btnSubmit, page);
}

async function updateInputValue(page) {
  const inputSize =
    'div#ProdutoEstoqueCombinacaoAtributo2Id_chosen > a.chosen-single span';
  const sizeP = '30cm x 45cm';
  const sizeM = '40cm x 60cm';
  const sizeG = '60cm x 90cm';

  const valueP = '227,14';

  // Espera até que o seletor da tag <a> esteja disponível na página
  await page.waitForSelector(inputSize);

  // Recupera valor do span de tamanho do produto
  const spanText = await page.$eval(inputSize, span => span.textContent.trim());

  // Atualiza valores
  if (spanText === sizeP) {
    await updateValues(page, valueP);
  }
}

export { updateInputValue }