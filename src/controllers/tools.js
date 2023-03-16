async function click(selectorElement, page) {
  await page.waitForSelector(selectorElement);
  await page.click(selectorElement);
}

async function waitForURL(page, urlPart) {
  const timeout = 60000; // tempo máximo de espera em milissegundos
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (page.url().includes(urlPart)) {
      return;
    }
    await page.waitForTimeout(500);
  }

  throw new Error(`Timeout: URL contendo ${urlPart} não foi encontrada`);
}

function getNumberEnd(str) {
  const match = str.match(/\d+$/);
  return match ? parseInt(match[0]) : null;
}

export { click, waitForURL, getNumberEnd };
