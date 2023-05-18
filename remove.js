import puppeteer from "puppeteer"
import dotenv from "dotenv"
import { initPuppeteer } from "./src/config.js"
import { waitForURL } from "./src/controllers/tools.js"
import { removeOption } from "./src/controllers/removeOption.js"

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
	
	const URLPainel = process.env.URLPAINEL
	const URLProdutos = process.env.URLPRODUTOS

	await page.goto(URLPainel);
	(await page.url()) !== URLPainel ? await login(page) : "" // \n

	// await page.goto(URLProdutos)
	try {
		// Esperar pela página de catálogo de produtos
		await waitForURL(page, "produtos")

		// Remover opções
		await removeOption(page, browser)
	} catch (err) {
		const error = err.message === "No element found for selector: a#ui-id-6"
			? "Excesso de requisições"
			: err.message
		console.log(error)
		await browser.close()
	}
})()
