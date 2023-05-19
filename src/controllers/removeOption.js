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

async function selectCheckBox(element){
	element.checked = true
}

async function remove(browser, page, amountFrames) {
	const rows = await page.$$("table.tabela-variacoes tbody tr")

	for (const row of rows) {
		const size = await row.$eval("td:nth-child(3)", (td) => td.textContent.trim())
		const frame = await row.$eval("td:nth-child(4)", (td) => td.textContent.trim())
      
		if(frame === "Borda infinita") {
			await row.$eval(("input.delete"), (input) => input.checked = true)
		}
		
		if(amountFrames !== 1 || amountFrames !== "1") {
			if(size === "150cm x 100cm" || frame === "Borda infinita") {
				await row.$eval(("input.delete"), (input) => input.checked = true)
			}			
		}
	}

	await new Promise((resolve) => setTimeout(resolve, 1000))
	await page.waitForSelector("div.btn-actions a.btn-delete-variation")
	const deleteButton = await page.$("div.btn-actions a.btn-delete-variation")
	await deleteButton.focus()
	await deleteButton.click()
	await new Promise((resolve) => setTimeout(resolve, 1000))
}