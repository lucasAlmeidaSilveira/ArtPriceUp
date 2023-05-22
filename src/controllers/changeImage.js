import { closeAllPagesExceptFirst, extractLastNumber, findAmountFrames, handleClick } from "./tools.js"

export async function loopForEachImage(page, browser){
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

			await editProduct(row, browser)

		} catch (error) {
			// console.log(error)
		}
	}

	if (!btnNext) {
		return
	}

	await handleClick(btnNext, page)
	await loopForEachImage(page, browser)
}

export async function editProduct(row, browser) {
	const editButton = await row.$("td:nth-child(6) a[title='Editar']")
	const link = await editButton.getProperty("href")
	const href = await link.jsonValue()

	await openNewPage(href, browser)
}

export async function openNewPage(link, browser) {
	const newPage = await browser.newPage()
	await newPage.goto(link)

	const displaySize = await newPage.evaluate(() => {
		return {
			width: window.screen.width,
			height: window.screen.height,
			deviceScaleFactor: 1
		}
	})

	await newPage.setViewport(displaySize)

	// Dando o log do produto que está sendo editado
	const selectInputName = "input#ProdutoNome"
	const nameProduct = await newPage.$eval(selectInputName, (input) => input.value)
	console.log(nameProduct)
	
	// Clique nas variações
	const btnVariacoes = "a#ui-id-6"
	await handleClick(btnVariacoes, newPage)

	await changeImage(browser, newPage)
  
	await newPage.close()
	await closeAllPagesExceptFirst(browser)
}

async function changeImage(browser, page){
	const rows = await page.$$("table.tabela-variacoes tbody tr")

	for (const row of rows) {
		try {
			const editButton = await row.$("td:nth-child(9) a[title='Editar']")
			const link = await editButton.getProperty("href")
			const href = await link.jsonValue()
		
			const newPage = await browser.newPage()

			const displaySize = await page.evaluate(() => {
				return {
					width: window.screen.width,
					height: window.screen.height,
					deviceScaleFactor: 1
				}
			})

			await newPage.setViewport(displaySize)

			await newPage.goto(href)

			// Rolar até o final da página
			await page.evaluate(() => {
				window.scrollTo(0, document.body.scrollHeight)
			})

			await newPage.waitForNavigation()
			
			await newPage.close()
		} catch (error) {
			// console.log(error)
		}
	}
}