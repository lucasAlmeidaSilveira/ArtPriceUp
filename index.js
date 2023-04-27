import puppeteer from "puppeteer"
import dotenv from "dotenv"
import { initPuppeteer } from "./src/config.js"
import { findAmountFrames, changeValues, click, waitForURL } from "./src/controllers/tools.js"
import { updateTitle } from "./src/controllers/updateTitle.js"

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
	const URLpainel = process.env.URLPAINEL
	// const URLproducts = process.env.URLPRODUTOS
	// const btnVariacoes = "a#ui-id-6"
	// const contador = 1

	await page.goto(URLpainel);
	(await page.url()) !== URLpainel ? await login(page) : "" // \n

	try {
		const i = 10
		while (i > 1) {
			await waitForURL(page, "edit")

			// Tempo de atraso para carregamento da página
			await new Promise((resolve) => setTimeout(resolve, 1000))

			// // Recuperando quantidade de quadros
			// const amountFrames = findAmountFrames(page)

			// // Clique na tab variações
			// await click(btnVariacoes, page)

			// await changeValues(page, amountFrames)

			// Atualizando title
			await updateTitle(page)
		}

		// while (contador <= 18) {
		//   let selectBtnEdit = `table.tabela-variacoes tr:nth-child(${contador}) a[title="Editar"]`;
		//   if (selectBtnEdit) {
		//     await click(selectBtnEdit, page);
		//     await updateInputValue(page);

		//     contador += 1;
		//   }

		//   if (page.url() === URLproducts) {
		//     break;
		//   }
		// }

		// await page.goto(URLproducts);
	} catch (err) {
		const error = err.message === "No element found for selector: a#ui-id-6"
			? "Excesso de requisições"
			: err.message
		console.log(error)
		await browser.close()
	}
})()
