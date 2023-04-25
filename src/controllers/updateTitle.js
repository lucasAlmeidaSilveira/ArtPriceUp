import { findAmountFrames, findCategorie, findValueInput } from "./tools.js"

export async function updateTitle(page){
	const categorie = await findCategorie(page)
	const oldTitle = await findValueInput(page, "#ProdutoNome")
	const amountFrames = await findAmountFrames(page)
	// const pageProducts = "https://www.outletdosquadros.com.br/painel/catalogo/produtos/index"
	// const btnSave = " btn-toolbar-fixed a.btn-submit-false" || "a.btn-submit-false"

	if (!oldTitle.includes("Espelho")) {
		if (!oldTitle.includes("Quadro Decorativo")) {
			const formattedTitle = oldTitle
				.replace("Kit", "")
				.replace("quadro", "")
				.replace("quadros", "")
				.replace(/\d+/g, "")
				.trim()
  
			const newTitle = `Quadro decorativo ${amountFrames} telas ${categorie} ${formattedTitle}`
			await page.$eval("#ProdutoNome", (el, value) => el.value = value, newTitle)      
		}
	}

	// await click(btnSave, page)
	// await page.goto(pageProducts)
}