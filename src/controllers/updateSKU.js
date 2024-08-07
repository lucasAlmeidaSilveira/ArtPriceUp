import { extractLastNumber, findAmountFrames, findValueInput, handleClick, updateInputValue } from "./tools.js"

export async function updateSKU(page, browser){
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
	await updateSKU(page, browser)
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

	await updateAllSKU(newPage, SKU, amountFrames)
  
	const btnSave = "button.btn-submit"
	await handleClick(btnSave, newPage)
	await newPage.close()	
}

async function updateAllSKU(page, SKU, amountFrames) {
	const rows = await page.$$("table.tabela-variacoes tbody tr")

	rows.forEach(async (row) => {
		// INPUT SKU
		const selectInputSKU = "input#ProdutoEstoqueSku"
    
		// RECUPERAR VALOR DA COR DA MOLDURA
		const selectFrameInputValue = "td:nth-child(4)"
		const frameInputValue = await row.$eval(selectFrameInputValue, (td) => td.textContent.trim())
    
		// RECUPERAR VALOR DO MATERIAL
		const selectMaterialInputValue = "td:nth-child(2)"
		const materialInputValue = await row.$eval(selectMaterialInputValue, (td) => td.textContent.trim())

		// RECUPERAR VALOR DO TAMANHO
		const selectSizeInputValue = "td:nth-child(3)"
		const sizeInputValue = await row.$eval(selectSizeInputValue, (td) => td.textContent.trim())

		const newSKU = updateProductSKU(
			SKU, amountFrames, frameInputValue, materialInputValue, sizeInputValue
		)

		await updateInputValue(row, selectInputSKU, newSKU)
		await new Promise((resolve) => setTimeout(resolve, 500))
	})
}

function updateProductSKU(
	frameNumberInputValue, amountFrames, frameInputValue, materialInputValue, sizeInputValue
) {
	let frameNumberInput = frameNumberInputValue
	let productTypeInput = "A"
	let frameInput = frameInputValue
	let materialInput = materialInputValue
	let sizeInput = sizeInputValue
	let quantityInput = amountFrames
	let frame = filterFrame(materialInput, sizeInput, frameInput)

	const SKU = createCodeSKU(
		productTypeInput, frame, materialInput, sizeInput, quantityInput, frameNumberInput
	)

	return SKU
}

function filterFrame(materialInput, sizeInput, frameInput) {
	if(materialInput !== "Canvas (Tela de pintura)"){
		if(sizeInput !== "40cm x 60cm (10% OFF)" && (frameInput === "Branca")) {
			return "CAIXA BRANCA"
		}
		if(sizeInput !== "40cm x 60cm (10% OFF)" && (frameInput === "Preta")) {
			return "CAIXA PRETA"
		}
		if(sizeInput !== "40cm x 60cm (10% OFF)" && (frameInput === "Natural")) {
			return "CAIXA NATURAL"
		}
	}

	if(materialInput !== "Canvas (Tela de pintura)"){
		if((sizeInput === "40cm x 60cm (10% OFF)" || sizeInput === "50cm x 50cm") && (frameInput === "Branca")) {
			return "RETA BRANCA"
		}
		if((sizeInput === "40cm x 60cm (10% OFF)" || sizeInput === "50cm x 50cm") && (frameInput === "Preta")) {
			return "RETA PRETA"
		}
		if((sizeInput === "40cm x 60cm (10% OFF)" || sizeInput === "50cm x 50cm") && (frameInput === "Natural")) {
			return "RETA NATURAL"
		}
	}

	if(materialInput === "Canvas (Tela de pintura)"){
		if(frameInput === "Branca") {
			return "CANALETA BRANCA"
		}
		if(frameInput === "Preta") {
			return "CANALETA PRETA"
		}
		if(frameInput === "Natural") {
			return "CANALETA NATURAL"
		}
	}
}

function createCodeSKU(
	productType, frame, material, size, quantity, frameNumber
){
	const code = `${frameNumber}-${productType}-`
  
	const opcoes = {
		frame: {
			"RETA BRANCA": "A",
			"RETA PRETA": "B",
			"RETA NATURAL": "C",
			"CAIXA BRANCA": "D",
			"CAIXA PRETA": "E",
			"CAIXA NATURAL": "F",
			"BORDA INFINITA": "G",
			"CANALETA BRANCA": "H",
			"CANALETA PRETA": "I",
			"CANALETA NATURAL": "J"
		},
		material: {
			"Quadro com vidro (Mais Vendido)": "A",
			"Quadro sem vidro (Mais econômico)": "B",
			"Canvas (Tela de pintura)": "B"
		},
		size: {
			"30X45": "A",
			"40cm x 60cm (10% OFF)": "B",
			"60cm x 90cm (30% OFF)": "C",
			"120cm x 80cm": "D",
			"150cm x 100cm": "E",
			"120cm x 120cm": "F",
			"50cm x 50cm": "G",
			"70cm x 70cm": "H",
			"90cm x 90cm (30% OFF)": "I"
		},
		quantity: {
			"1": "A",
			"2": "B",
			"3": "C",
			"4": "D"
		}
	}
  
	const getCode = (option, value) => opcoes[option][value] || "-"
    
	const frameCode = getCode("frame", frame)
	const materialCode = getCode("material", material)
	const sizeCode = getCode("size", size)
	const quantityCode = getCode("quantity", quantity)

	return `OT${code}${frameCode}-${materialCode}-${sizeCode}-${quantityCode}`
}


