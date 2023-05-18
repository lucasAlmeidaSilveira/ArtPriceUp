import { editRow, handleClick } from "./tools.js"

export async function removeOption(page, browser) {
	const rows = await page.$$("table#tb-produtos tbody tr")
	const btnNext = ".pagination .btn-next a"

	for (const row of rows) {
		try {
			await editRow(row, browser, remove)
		} catch (error) {
			// console.log(error)
		}
	}
	
	if (!btnNext) {
		return
	}

	await handleClick(btnNext, page)
	await removeOption(page, browser)
}

async function remove(browser, page, amountFrames) {
	const rows = await page.$$("table.tabela-variacoes tbody tr")

	for (const row of rows) {
		try {
			const size = await row.$eval("td:nth-child(3)", (td) => td.textContent.trim())
			const frame = await row.$eval("td:nth-child(4)", (td) => td.textContent.trim())
			const btnDelete = await row.$("button.excluir-variacao")
      
			if(amountFrames === "1" && frame === "Borda infinita") {
				await btnDelete.click()
				const confirmDelete = await page.$("a.modal-alert-confirm")
				await confirmDelete.click()
				await page.waitForNavigation()
				continue
			}
      
			if(size === "150cm x 100cm" || frame === "Borda infinita") {
				await btnDelete.click()
				const confirmDelete = await page.$("a.modal-alert-confirm")
				await confirmDelete.click()
				await page.waitForNavigation()
			}			
		} catch (error) {
			// console.log(error)
		}
	}
}