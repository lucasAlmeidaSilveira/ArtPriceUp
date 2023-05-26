import { handleClick, findAmountFrames, findCategorie, findValueInput } from "./tools.js"

export async function updateTitles(page, browser){
	const rows = await page.$$("table#tb-produtos tbody tr")
	const btnNext = ".pagination .btn-next a"

	for (const row of rows) {
		try {
			await editRow(row, browser)
		} catch (error) {
			// console.log(error)
		}
	}
	
	if (!btnNext) {
		return
	}

	await handleClick(btnNext, page)
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
	let amountFrames = await findAmountFrames(page) === null ? "1" : await findAmountFrames(page)
	if(amountFrames === null || amountFrames === false) {
		amountFrames = "1"
	}
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

	await handleClick(btnSave, page)

	return
}