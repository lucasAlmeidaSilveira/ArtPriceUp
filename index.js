import puppeteer from "puppeteer"
import dotenv from "dotenv"
import { initPuppeteer } from "./src/config.js"
import { waitForURL } from "./src/controllers/tools.js"
import { updateTitles } from "./src/controllers/updateTitle.js"

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
		// Esperar pela página de catálogo de produtos
		await waitForURL(page, "catalogo")
		await new Promise((resolve) => setTimeout(resolve, 1000))

		await updateTitles(page, browser)

		// Recuperando quantidade de quadros
		// const amountFrames = findAmountFrames(page)

		// // Clique na tab variações
		// await click(btnVariacoes, page)

		// await changeValues(page, amountFrames)
	} catch (err) {
		const error = err.message === "No element found for selector: a#ui-id-6"
			? "Excesso de requisições"
			: err.message
		console.log(error)
		await browser.close()
	}
})()
