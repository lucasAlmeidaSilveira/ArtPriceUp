import { click, findAmountFrames, findCategorie, findValueInput } from "./tools.js"

export async function updateTitle(page){
	let categorie = await findCategorie(page)
	const oldTitle = await findValueInput(page, "#ProdutoNome")
	const amountFrames = await findAmountFrames(page)
	// const btnSave = " btn-toolbar-fixed a.btn-submit-false" || "a.btn-submit-false"
	// const pageProducts = "https://www.outletdosquadros.com.br/painel/catalogo/produtos/index"

	if (!oldTitle.includes("Espelho")) {
		if (!oldTitle.includes("Quadro Decorativo")) {
			const formattedTitle = oldTitle
				.replace(/kit?/gi, "")
				.replace(/quadro?/gi, "")
				.replace(/quadros?/gi, "")
				.replace(/\d+/g, "")
				.trim()
      
			categorie === "Todos os quadros" ? categorie = "" : categorie

			const newTitle = `Quadro Decorativo ${amountFrames} Telas ${categorie} ${formattedTitle}`
			await page.$eval("#ProdutoNome", (el, value) => el.value = value, newTitle)      
		}
	}

	// await click(btnSave, page)
	// await page.goto(pageProducts)
}