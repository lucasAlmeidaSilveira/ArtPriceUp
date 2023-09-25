import { extractLastNumber, findAmountFrames, findValueInput, handleClick, updateInputValue } from "./tools.js"
import { sizeP, sizeM, sizeG, sizeGG} from "../db/pricesFrames.js"

export async function updatePricePercent(page, browser){
	const rows = await page.$$("table#tb-produtos tbody tr")
	const btnNext = ".pagination .btn-next a"

	// Dando o log do número da página que está ativa
	const url = page.url()
	let pageNumber = extractLastNumber(url)
	if(pageNumber === null) {
		pageNumber = "1"
	}
	console.log("Página:", pageNumber)

	for (const row of rows) {
		try {
			// Verificando se o produto atual é espelho ou não
			const selectNameProduct = "td .product-info .product-nome"
			const nameProduct = await row.$eval(selectNameProduct, (span) => span.textContent.trim())
			const regexEspelho = /espelho/i
			const isMirror = regexEspelho.test(nameProduct)
						
			if(isMirror) {
				continue
			}

			await editRow(row, browser)
		} catch (error) {
			// console.log(error)
		}
	}
	
	if (!btnNext) {
		return
	}

	await handleClick(btnNext, page)
	await updatePricePercent(page, browser)
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

	// DANDO O LOG DO PRODUTO QUE ESTÁ SENDO EDITADO
	const selectInputName = "input#ProdutoNome"
	const nameProduct = await newPage.$eval(selectInputName, (input) => input.value)
	console.log(nameProduct)

	// RECUPERANDO VALOR DO SKU
	const selectInputSKU = "input#ProdutoSku"
	const SKU = await findValueInput(newPage, selectInputSKU)
	
	// RECUPERANDO VALOR DA QUANTIDADE DE TELAS
	const amountFrames = await findAmountFrames(newPage)

	// CLIQUE NAS VARIAÇÕES
	const btnVariacoes = "a#ui-id-6"
	await handleClick(btnVariacoes, newPage)

	await updateAllPrice(newPage, SKU, amountFrames)
  
	const btnSave = "button.btn-submit"
	await handleClick(btnSave, newPage)
	await newPage.close()	
}

async function updateAllPrice(page, SKU, amountFrames) {
	const rows = await page.$$("table.tabela-variacoes tbody tr")

	rows.forEach(async (row) => {
		// INPUT Price
		const selectInputPrice = "input#ProdutoEstoqueValorVenda"
    
		// RECUPERAR VALOR DO MATERIAL
		const selectMaterialInputValue = "td:nth-child(2)"
		const materialInputValue = await row.$eval(selectMaterialInputValue, (td) => td.textContent.trim())

		// RECUPERAR VALOR DO TAMANHO
		const selectSizeInputValue = "td:nth-child(3)"
		const sizeInputValue = await row.$eval(selectSizeInputValue, (td) => td.textContent.trim())

		const newPrice = updateProductPricePercent(amountFrames, materialInputValue, sizeInputValue)

		await updateInputValue(row, selectInputPrice, newPrice)
		await new Promise((resolve) => setTimeout(resolve, 500))
	})
}

function updateProductPricePercent(amountFrames, materialInputValue, sizeInputValue) {
// Selecionar o objeto de tamanho com base em sizeInputValue
	let sizeObj
	switch (sizeInputValue) {
	case "40cm x 60cm - 10% OFF":
		sizeObj = sizeP
		break
	case "50cm x 50cm":
		sizeObj = sizeP
		break
	case "60cm x 90cm (MAIS VENDIDO) - 30% OFF":
		sizeObj = sizeM
		break
	case "70cm x 70cm":
		sizeObj = sizeM
		break
	case "120cm x 80cm":
		sizeObj = sizeG
		break
	case "90cm x 90cm (30% OFF)":
		sizeObj = sizeG
		break
	case "150cm x 100cm":
		sizeObj = sizeGG
		break
	case "120cm x 120cm":
		sizeObj = sizeGG
		break
	default:
		console.log("Tamanho não encontrado.")
		return // Sair da função se o tamanho não for encontrado
	}

	// Encontrar o objeto correspondente ao material
	const materialObj = sizeObj.material.find((material) => material.type === materialInputValue)

	if (materialObj) {
	// Encontrar a variação com base em amountFrames
		const variation = materialObj.variations.find((v) => v.amountFrames === amountFrames.toString())

		if (variation) {                 
		// Atualizar o valor de price com o valor da variação, sendo valor 10% maior
		// Corrigir o formato da string de preço (substituir "," por ".") e converter para número
			const priceString = variation.value.replace(",", ".")
			const price = parseFloat(priceString)

			let pricePercent

			if(sizeInputValue.includes("30% OFF")) {
				pricePercent = (price * 1.3).toFixed(2)
			} else {
				pricePercent = (price * 1.1).toFixed(2)
			}
			
			return pricePercent
		}
	}
}



