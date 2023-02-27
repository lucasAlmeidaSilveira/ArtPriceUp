async function click(element, page) {
  await page.waitForSelector(element);
  await page.click(element);
}

export { click };
