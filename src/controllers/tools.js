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

export async function changeValue(page){
	const table = await page.$("table.tabela-variacoes")
	const rows = await table.$$("tbody tr")

	rows.forEach(async (row) => {
		const selectorInputValue = "td:nth-child(8) input"
		const sizeFrame = await row.$eval("td:nth-child(3)", (td) => td.textContent.trim())

		switch (sizeFrame) {
		case "30cm x 45cm":
			await row.$eval(
				selectorInputValue,
				(input, valor) => (input.value = valor),
				"99,00",
			)
			break
		
		default:
			break
		}
	}) 
}
