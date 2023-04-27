import { click, findAmountFrames, findCategorie, findValueInput } from "./tools.js"

export async function updateTitle(page){
	let categorie = await findCategorie(page)
	const oldTitle = await findValueInput(page, "#ProdutoNome")
	const amountFrames = await findAmountFrames(page)
	const btnSave = "button.btn-submit"
	const pageProducts = "https://www.outletdosquadros.com.br/painel/catalogo/produtos/index"

	if (!oldTitle.includes("Espelho")) {
		if (!oldTitle.includes("Quadro Decorativo")) {
			const formattedTitle = oldTitle
				.replace(/kit?/gi, "")
				.replace(/quadros?/gi, "")
				.replace(/quadro?/gi, "")
				.replace(/\d+/g, "")
				.trim()
      
			categorie === "Todos os quadros" ? categorie = "" : categorie

			const newTitle = `Quadro Decorativo ${amountFrames} Tela${amountFrames > 1 ? "s" : ""} ${categorie} ${formattedTitle}`
			await page.$eval("#ProdutoNome", (el, value) => el.value = value, newTitle)      
		}
	}

	await click(btnSave, page)
	await page.goto(pageProducts)
	return
}