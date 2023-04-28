import { click as clickButton, findAmountFrames, findCategorie, findValueInput } from "./tools.js"

export async function updateTitles(page, browser){
	const rows = await page.$$("table#tb-produtos tbody tr")

	for (const row of rows) {
		try {
			await editRow(row, browser)
		} catch (error) {
			// console.log(error)
		}
	}

	await page.waitForNavigation()
	await updateTitles(page, browser)
}

async function editRow(row, browser) {
	const editButton = await row.$("td:nth-child(6) a[title='Editar']")
	const link = await editButton.getProperty("href")
	const href = await link.jsonValue()

	await openNewPage(href, browser)
}

async function openNewPage(link, browser) {
	const newPage = await browser.newPage()
	
	await newPage.goto(link)
  
	await updateTitle(newPage)
  
	await newPage.close()
}

export async function updateTitle(page){

	let categorie = await findCategorie(page)
	const oldTitle = await findValueInput(page, "#ProdutoNome")
	const amountFrames = await findAmountFrames(page)
	const btnSave = "button.btn-submit"

	if (!oldTitle.includes("Espelho")) {
		if (!oldTitle.includes("Quadro Decorativo")) {
			const formattedTitle = oldTitle
				.replace(/kit?/gi, "")
				.replace(/quadros?/gi, "")
				.replace(/quadro?/gi, "")
				.replace(/\d+/g, "")
				.trim()
      
			const newTitle = `Quadro Decorativo ${amountFrames} ${amountFrames > 1 ? "Telas" : "Tela"} ${categorie} ${formattedTitle}`
			await page.$eval("#ProdutoNome", (el, value) => el.value = value, newTitle)      
		}
	}

	await clickButton(btnSave, page)

	return
}