import { measurementsFrames } from "../db/measurementsFrames.js"
import { handleClick, updateInputValue } from "./tools.js"

export async function forEachVariations(browser, page, amountFrames){
	const rows = await page.$$("table.tabela-variacoes tbody tr")

	for (const row of rows) {
		try {
			const editButton = await row.$("td:nth-child(9) a[title='Editar']")
			const link = await editButton.getProperty("href")
			const href = await link.jsonValue()
		
			const newPage = await browser.newPage()
			await newPage.goto(href)

			// AÇÃO DE ATUALIZAÇÃO DAS MEDIDAS
			await updateMeasurements(newPage, amountFrames)
			
			await newPage.close()
		} catch (error) {
			// console.log(error)
		}
	}
}

async function updateMeasurements(newPage, amountFrames){
	// SELETORES
	const selectorSizeFrame = "#ProdutoEstoqueCombinacaoAtributo2Id_chosen a.chosen-single span"
	const selectorWeightFrame = "#ProdutoEstoquePesoLiquido"
	const selectorHeightFrame = "#ProdutoEstoqueAltura"
	const selectorWidthFrame = "#ProdutoEstoqueLargura"
	const selectorLengthFrame = "#ProdutoEstoqueComprimento"
	const btnSubmit = "button.btn.btn-icon.btn-submit"

	// RECUPERANDO VALORES
	const sizeFrame = await newPage.$eval(selectorSizeFrame, (span) => span.textContent.trim())

	const { width, height } = measurementsFrames[sizeFrame]

	const weightFrame = 6
	const heightFrame = height
	const widthFrame = width
	let lengthFrame = 0

	switch (amountFrames) {
	case "1":
		lengthFrame = 5
		break
	case "2":
		lengthFrame = 10
		break
	case "3":
		lengthFrame = 15
		break
    
	default:
		break
	}

	await updateInputValue(newPage, selectorWeightFrame, weightFrame)
	await updateInputValue(newPage, selectorHeightFrame, heightFrame)
	await updateInputValue(newPage, selectorWidthFrame, widthFrame)
	await updateInputValue(newPage, selectorLengthFrame, lengthFrame)

	// Salvar alterações
	await handleClick(btnSubmit, newPage)
}

