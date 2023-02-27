async function click(btn, page) {
  await page.waitForSelector(btn);
  await page.click(btn);
}

export { click };
