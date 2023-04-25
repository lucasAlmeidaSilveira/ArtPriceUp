import { sizeG, sizeGG, sizeM, sizeP } from "../db/pricesFrames.js"

export async function click(selectorElement, page) {
	await page.waitForSelector(selectorElement)
	await page.click(selectorElement)
}

export async function waitForURL(page, urlPart) {
	const timeout = 60000 // tempo máximo de espera em milissegundos
	const startTime = Date.now()

	while (Date.now() - startTime < timeout) {
		if (page.url().includes(urlPart)) {
			return
		}
		await page.waitForTimeout(500)
	}

	throw new Error(`Timeout: URL contendo ${urlPart} não foi encontrada`)
}

export function getNumberEnd(str) {
	const match = str.match(/\d+$/)
	return match ? parseInt(match[0]) : null
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

export async function findCategorie(page) {
	const selector = ".categorias-adicionais li label:after"
	const labels = await page.$$(selector)

	const filteredLabels = await Promise.all(labels.map(async (label) => {
		const li = await label.$eval("..", (el) => el)
		const input = await li.$("input")
		const text = await label.$eval(":first-child", (el) => el.innerText)
		if (input && text) {
			return text
		}
	}))

	return filteredLabels.filter(Boolean)
}

export async function findValueInput(page, selector){
	const selectorInput = await page.$(selector)
	const valueInput = await page.evaluate((input) => input.value, selectorInput)

	return valueInput
}

export async function findAmountFrames(page){
	const selectInputSKU = "input#ProdutoSku"
	const productSKU = await page.$eval(selectInputSKU, (input) => input.value)
	const amountFrames = productSKU.slice(-1)

	return amountFrames
}