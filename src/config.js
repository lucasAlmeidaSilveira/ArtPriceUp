async function initPuppeteer(puppeteer) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--start-maximized'],
  });
  const page = await browser.newPage();

  const displaySize = await page.evaluate(() => {
    return {
      width: window.screen.width,
      height: window.screen.height,
      deviceScaleFactor: 1,
    };
  });

  await page.setViewport(displaySize);

  return { page, browser };
}

export { initPuppeteer };
