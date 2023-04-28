import { sizeG, sizeGG, sizeM, sizeP } from "../db/pricesFrames.js"
import { click } from "./tools.js"

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
	await click(checkBoxPromo, page)

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

export async function updateInputValue(page) {
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
	await click(selectBtnSubmit, page)
}

export async function updateValueSize(
	size,
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
}

export async function changeValues(page, amountFrames) {
	const table = await page.$("table.tabela-variacoes")
	const rows = await table.$$("tbody tr")

	rows.forEach(async (row) => {
		const selectorInputValue = "td:nth-child(8) input"
		const materialFrame = await row.$eval("td:nth-child(2)", (td) =>
			td.textContent.trim())
		const sizeFrame = await row.$eval("td:nth-child(3)", (td) =>
			td.textContent.trim())
		// const productSKUFull = await row.$eval("td:nth-child(5)", (td) => td.textContent.trim())

		updateValueSize(
			sizeP,
			sizeFrame,
			materialFrame,
			selectorInputValue,
			amountFrames,
			row
		)
		updateValueSize(
			sizeM,
			sizeFrame,
			materialFrame,
			selectorInputValue,
			amountFrames,
			row
		)
		updateValueSize(
			sizeG,
			sizeFrame,
			materialFrame,
			selectorInputValue,
			amountFrames,
			row
		)
		updateValueSize(
			sizeGG,
			sizeFrame,
			materialFrame,
			selectorInputValue,
			amountFrames,
			row
		)
	})
}
