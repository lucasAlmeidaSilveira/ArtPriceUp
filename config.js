const configPage = {
  width: 1920,
  height: 1080,
  deviceScaleFactor: 1,
};

async function initPuppeteer(puppeteer) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--start-fullscreen'],
  });
  const page = await browser.newPage();

  await page.setViewport(configPage);

  return page;
}

export { initPuppeteer };
