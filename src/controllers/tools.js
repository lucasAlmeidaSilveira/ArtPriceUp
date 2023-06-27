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
	const valueInput = await page.$eval(selector, (element) => element.value)

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
			number = "1"
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

	// Dando o log do número da página que está ativa
	const url = page.url()
	let pageNumber = extractLastNumber(url)
	if(pageNumber === null) {
		pageNumber = "1"
	}
	console.log("Página:", pageNumber)

	for (const row of rows) {
		try {
			// Verificando se o produto já foi atualizado
			const selectPriceProduct = "td:nth-child(3)"
			const priceProduct = await row.$eval(selectPriceProduct, (td) => td.textContent.trim())
			
			// const isUpdated = priceProduct.includes("R$ 299,00")
			const isUpdated = false
			
			// Verificando se o produto atual é espelho ou não
			const selectNameProduct = "td .product-info .product-nome"
			const nameProduct = await row.$eval(selectNameProduct, (span) => span.textContent.trim())
			const regexEspelho = /espelho/i
			const isMirror = regexEspelho.test(nameProduct)
			
			if(isMirror || isUpdated) {
				continue
			}

			await editProduct(row, browser, action)

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

export async function editProduct(row, browser, action) {
	const editButton = await row.$("td:nth-child(6) a[title='Editar']")
	const link = await editButton.getProperty("href")
	const href = await link.jsonValue()

	await openNewPage(href, browser, action)
}

export async function editRow(row, browser, action) {
	const editButton = await row.$("td:nth-child(6) a[title='Editar']")
	const link = await editButton.getProperty("href")
	const href = await link.jsonValue()

	await openNewPage(href, browser, action)
}

export async function openNewPage(link, browser, action) {
	const newPage = await browser.newPage()
	await newPage.goto(link)

	const amountFrames = await findAmountFrames(newPage)
	
	// Dando o log do produto que está sendo editado
	const selectInputName = "input#ProdutoNome"
	const nameProduct = await newPage.$eval(selectInputName, (input) => input.value)
	console.log(nameProduct)
	
	// Clique nas variações
	const btnVariacoes = "a#ui-id-6"
	await handleClick(btnVariacoes, newPage)
	if(amountFrames === "2" || amountFrames === "3") {
		await action(browser, newPage, amountFrames)
	}
  
	await newPage.close()
	await closeAllPagesExceptFirst(browser)
}

export async function closeAllPagesExceptFirst(browser) {
	const pages = await browser.pages()

	for (let i = 2; i < pages.length; i++) {
		await pages[i].close()
	}
}

export async function updateInputValue(row, selector, value) {
	await row.$eval(selector, (element, val) => {
		element.value = val
	}, value)
}

