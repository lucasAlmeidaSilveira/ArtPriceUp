export async function handleClick(selectorElement, page) {
	const element = await page.$(selectorElement)

	if (element !== null) {
		await page.waitForSelector(selectorElement)
		await page.click(selectorElement)
	} 
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

export async function findCategorie(page) {
	const selectorCheckedLabels = ".categorias-adicionais li input:checked"

	const checkedLabels = await page.$$eval(selectorCheckedLabels, (labels) => labels.map((label) => label.textContent))

	if (checkedLabels[0] === "Todos os Quadros") {
		return checkedLabels[1].replace(/_/g, "")
	}
	return checkedLabels[0]
}

export async function findValueInput(page, selector){
	const selectorInput = await page.$(selector)
	const valueInput = await page.evaluate((input) => input.value, selectorInput)

	return valueInput
}

export async function findAmountFrames(page){
	// RECUPERANDO POR MEIO DO SKU | OLD 
	// const selectInputSKU = "input#ProdutoSku"
	// const amountFrames = await page.$eval(selectInputSKU, (input) => input.value)
	// // const amountFrames = productSKU.slice(-1)

	// return amountFrames

	const selectInputName = "input#ProdutoNome"
	const value = await page.$eval(selectInputName, (input) => input.value)
	const regex = /Quadro Decorativo (\d+)/
	const match = value.match(regex)

	if (match) {
		const number = match[1]
		return number
	} else {
		let number = value.match(/\d+/g)
		if(!number) {
			number = 1
		}
		return number
	}
}

export function getLastExpression(url) {
	const lastSlashIndex = url.lastIndexOf("/")
	return url.substring(lastSlashIndex + 1)
}

export function extractLastNumber(url) {
	const regex = /(\d+)$/
	const match = url.match(regex)
	return match ? match[1] : null
}

export async function loopForEach(page, browser, action){
	const rows = await page.$$("table#tb-produtos tbody tr")
	const btnNext = ".pagination .btn-next a"

	for (const row of rows) {
		try {
			const selectNameProduct = "td .product-info .product-nome"
			const nameProduct = await row.$eval(selectNameProduct, (span) => span.textContent.trim())
			const regex = /espelho/i
			const isMirror = regex.test(nameProduct)
			const page = extractLastNumber(page.url())
			console.log("Página:", page)
			
			if(isMirror) {
				continue
			} else {
				// await editProduct(row, browser, action)
			}

		} catch (error) {
			// console.log(error)
		}
	}

	if (!btnNext) {
		return
	}

	await handleClick(btnNext, page)
	await loopForEach(page, browser, action)
}

async function editProduct(row, browser, action) {
	const editButton = await row.$("td:nth-child(6) a[title='Editar']")
	const link = await editButton.getProperty("href")
	const href = await link.jsonValue()

	await openNewPage(href, browser, action)
}

export async function openNewPage(link, browser, action) {
	const newPage = await browser.newPage()
	await newPage.goto(link)

	const btnVariacoes = "a#ui-id-6"
	const amountFrames = await findAmountFrames(newPage)
	
	// Clique nas variações
	await handleClick(btnVariacoes, newPage)
  
	await action(browser, newPage, amountFrames)

	async function closeAllPagesExceptFirst(browser) {
		const pages = await browser.pages()
	
		for (let i = 2; i < pages.length; i++) {
			await pages[i].close()
		}
	}
  
	await newPage.close()
	await closeAllPagesExceptFirst(browser)
}