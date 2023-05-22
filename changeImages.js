import puppeteer from "puppeteer"
import dotenv from "dotenv"
import { initPuppeteer } from "./src/config.js"
import { waitForURL } from "./src/controllers/tools.js"
import { loopForEachImage } from "./src/controllers/changeImage.js"

dotenv.config()

async function login(page) {
	/* Dados de acesso */
	await page.type("#user", process.env.USER)
	await page.type("#senha", process.env.PASS)
	/* Dados de acesso */

	await page.click(".form-field > #do-login")

	await page.waitForNavigation()
}

(async () => {
	const { page, browser } = await initPuppeteer(puppeteer)
	const pages = await browser.pages()

	// Fechando a primeira aba aberta
	await pages[0].close()
	
	const URLpainel = process.env.URLPAINEL
	// const URLproducts = process.env.URLPRODUTOS
	// const btnVariacoes = "a#ui-id-6"
	// const contador = 1

	await page.goto(URLpainel);
	(await page.url()) !== URLpainel ? await login(page) : "" // \n

	try {
		const pageProducts = process.argv[2]
		
		if(pageProducts) {
			await page.goto(`https://www.outletdosquadros.com.br/painel/catalogo/produtos/index/page:${pageProducts}`)
		} else {
			// Esperar pela página de catálogo de produtos
			await waitForURL(page, "produtos")
		}

		// ATUALIZAR VALORES
		await loopForEachImage(page, browser)

	} catch (err) {
		const error = err.message === "No element found for selector: a#ui-id-6"
			? "Excesso de requisições"
			: err.message
		console.log(error)
		await browser.close()
	}
})()
