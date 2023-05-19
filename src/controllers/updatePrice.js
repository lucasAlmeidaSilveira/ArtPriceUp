import { sizeM, sizeP } from "../db/pricesFramesMaio.js"
import { findAmountFrames, handleClick } from "./tools.js"

const selectInputValue = "input#ProdutoEstoqueValorVenda"
const selectBtnSubmit = "button.btn.btn-icon.btn-submit"
const selectInputInitPromo = "#ProdutoEstoquePromocaoDataInicio"
const selectInputEndPromo = "#ProdutoEstoquePromocaoDataFim"
const selectInputPercentual = "#ProdutoEstoquePercentualPromocao"

export async function solutionBug(page) {
	await page.focus(selectInputPercentual)
	await page.keyboard.type("25")
	await page.keyboard.press("Tab")
	await page.focus(selectInputPercentual)
	await page.keyboard.type("30")
	await page.keyboard.press("Tab")
}

export async function updateValueDefault(page, checkBoxPromo) {
	// Clica no botão de Promoção
	await handleClick(checkBoxPromo, page)

	// Atualiza valor de desconto para 30
	await page.focus(selectInputPercentual)
	await page.keyboard.type("30")
	await page.keyboard.press("Tab")

	// Atualiza valor data de inicio da promoção
	await page.$eval(selectInputInitPromo,
		(input) => (input.value = "23/02/2023"))

	// Atualiza valor data de fim da promoção
	await page.$eval(selectInputEndPromo, (input) => (input.value = "01/01/2024"))
}

export async function clickDatePromoAutomatic(page){
	// Atualiza valor data de inicio da promoção
	await page.$eval(selectInputInitPromo,
		(input) => (input.value = "23/02/2023"))

	// Atualiza valor data de fim da promoção
	await page.$eval(selectInputEndPromo, (input) => (input.value = "01/01/2034"))
}

export async function updateValue(page, checkBoxPromo){
	// Clica no botão de Promoção
	await handleClick(checkBoxPromo, page)

	// Atualiza valor de desconto

	// Atualiza data da promoção
	await clickDatePromoAutomatic(page)
}

export async function forEachVariations(browser, page, amountFrames){
	const rows = await page.$$("table.tabela-variacoes tbody tr")

	for (const row of rows) {
		try {
			const editButton = await row.$("td:nth-child(9) a[title='Editar']")
			const link = await editButton.getProperty("href")
			const href = await link.jsonValue()
		
			const newPage = await browser.newPage()
			await newPage.goto(href)

			// AÇÃO DE ATUALIZAÇÃO DOS VALORES
			await updateValueFrame(newPage, amountFrames)
			
			await newPage.close()
		} catch (error) {
			// console.log(error)
		}
	}
}

export async function updateValueFrame(page, amountFrames) {
	const checkBoxPromo = "#ProdutoEstoquePromocao"
	const checkBoxPromoManual = "#desconto_manual"
	const btnCancelPromo = "a.btn-promo-reset"
	const selectorMaterialFrame = "#ProdutoEstoqueCombinacaoAtributo1Id_chosen a.chosen-single span"
	const selectorSizeFrame = "#ProdutoEstoqueCombinacaoAtributo2Id_chosen a.chosen-single span"
	const selectorMolduraAcabamento = "#ProdutoEstoqueCombinacaoAtributo3Id_chosen a.chosen-single span"
	const selectorInputPrice = "input#ProdutoEstoqueValorPromocao"
	const btnSubmit = "button.btn.btn-icon.btn-submit"

	// Recuperando valores
	const materialFrame = await page.$eval(selectorMaterialFrame, (span) => span.textContent.trim())
	const sizeFrame = await page.$eval(selectorSizeFrame, (span) => span.textContent.trim())
	const typeFrame = await page.$eval(selectorMolduraAcabamento, (span) => span.textContent.trim())

	// Realiza a verificação do check box da promoção
	await page.waitForSelector(checkBoxPromo)
	const isChecked = await page.$eval(checkBoxPromo, (input) => input.checked)
	
	// Saindo dos tamanhos de quadros que não farão alteração
	const breakAction = sizeFrame === "60cm x 90cm (30% OFF)" || sizeFrame === "60cm x 90cm"

	if(!breakAction) {
		if(isChecked) {
			// Clique no check da promo
			await handleClick(btnCancelPromo, page)
		}
		await page.close()
		return
	}
	
	const isCheckedNew = await page.$eval(checkBoxPromo, (input) => input.checked)
	
	if(isCheckedNew === false){
		// Ativação da promoção
		await handleClick(checkBoxPromo, page)
		await handleClick(checkBoxPromoManual, page)
	}

	// ATUALIZA VALOR DE DESCONTO
	await updateValuePromo(
		sizeP,
		typeFrame,
		sizeFrame,
		materialFrame,
		selectorInputPrice,
		amountFrames,
		page
	)

	await updateValuePromo(
		sizeM,
		typeFrame,
		sizeFrame,
		materialFrame,
		selectorInputPrice,
		amountFrames,
		page
	)

	// Atualiza data da promoção
	await clickDatePromoAutomatic(page)

	// Salvar alterações
	await handleClick(btnSubmit, page)
}

export async function updateInputValuePromo30(page) {
	await page.waitForSelector("#ProdutoEstoquePromocao")
	const checkBoxPromo = "#ProdutoEstoquePromocao"
	// Realiza a verificação do check box da promoção
	const isChecked = await page.$eval(checkBoxPromo, (input) => input.checked)
	if (isChecked !== true) {
		// Recupera o valor do input do preço
		const value = await page.$eval(selectInputValue, (input) => input.value)
		// Realiza a conta da valor maior com 30% off
		const newValue = (parseFloat(value) / 0.7)
			.toFixed(2)
			.toString()
			.replace(".", ",")
		// Faz a atribuição do novo valor no input
		await page.$eval(selectInputValue,
			(input, valor) => (input.value = valor),
			newValue)
		// Realiza a configuração da promoção
		await updateValueDefault(page, checkBoxPromo)
	}

	await solutionBug(page)

	// Salva as configurações
	await handleClick(selectBtnSubmit, page)
}

async function updateValuePromo(
	size,
	typeFrame,
	sizeFrame,
	materialFrame,
	selectorInputValue,
	amountFrames,
	page
) {
	// if (size.size.includes(sizeFrame) && materialFrame === size.material[0].type) {
	// 	const value = size.material[0].variations[amountFrames - 1].value
		
	// 	await page.waitForSelector(selectorInputValue)
	// 	await page.$eval(selectorInputValue,
	// 		(input, valor) => (input.value = valor), value)
	// }

	if (size.size.includes(sizeFrame) && materialFrame === size.material[1].type) {
		const value = size.material[1].variations[amountFrames - 1].value

		await page.waitForSelector(selectorInputValue)
		await page.$eval(selectorInputValue,
			(input, valor) => (input.value = valor), value)
	}

	if (size.size.includes(sizeFrame) && materialFrame === size.material[2].type) {
		const value = size.material[2].variations[amountFrames - 1].value

		await page.waitForSelector(selectorInputValue)
		await page.$eval(selectorInputValue,
			(input, valor) => (input.value = valor), value)
	}
	
	if (size.size.includes(sizeFrame) && materialFrame === "Canvas (Tela de pintura)" && typeFrame !== "Borda infinita") {
		const value = size.material[3].variations[amountFrames - 1].value

		await page.waitForSelector(selectorInputValue)
		await page.$eval(selectorInputValue,
			(input, valor) => (input.value = valor), value)
	}
}

export async function updateValueSize(
	size,
	typeFrame,
	sizeFrame,
	materialFrame,
	selectorInputValue,
	amountFrames,
	row
) {
	
	if (sizeFrame === size.size && materialFrame === size.material[0].type) {
		await row.$eval(selectorInputValue,
			(input, valor) => (input.value = valor),
			size.material[0].variations[amountFrames - 1].value)
	}

	if (sizeFrame === size.size && materialFrame === size.material[1].type) {
		await row.$eval(selectorInputValue,
			(input, valor) => (input.value = valor),
			size.material[1].variations[amountFrames - 1].value)
	}

	if (sizeFrame === size.size && materialFrame === size.material[2].type) {
		await row.$eval(selectorInputValue,
			(input, valor) => (input.value = valor),
			size.material[2].variations[amountFrames - 1].value)
	}

	if (sizeFrame === size.size && materialFrame === "Canvas" && typeFrame !== "Borda infinita") {
		await row.$eval(selectorInputValue,
			(input, valor) => (input.value = valor),
			size.material[3].variations[amountFrames - 1].value)
	}

	return
}

export async function changeValues(page, amountFrames) {
	const table = await page.$("table.tabela-variacoes")
	const rows = await table.$$("tbody tr")
	const btnSave = "button.btn-submit"

	rows.forEach(async (row) => {
		const selectorInputValue = "td:nth-child(8) input"
		const materialFrame = await row.$eval("td:nth-child(2)", (td) =>
			td.textContent.trim())
		const typeFrame = await row.$eval("td:nth-child(4)", (td) => td.textContent.trim())
		const sizeFrame = await row.$eval("td:nth-child(3)", (td) =>
			td.textContent.trim())
		// const productSKUFull = await row.$eval("td:nth-child(5)", (td) => td.textContent.trim())

		updateValueSize(
			sizeP,
			typeFrame,
			sizeFrame,
			materialFrame,
			selectorInputValue,
			amountFrames,
			row
		)
		updateValueSize(
			sizeM,
			typeFrame,
			sizeFrame,
			materialFrame,
			selectorInputValue,
			amountFrames,
			row
		)

		// Atualiza data da promoção
		await clickDatePromoAutomatic(page)
	})

	// await handleClick(btnSave, page)	
}
