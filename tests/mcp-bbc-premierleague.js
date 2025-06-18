const { chromium } = require("playwright");

async function runScenario() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Step 1: Navigate to BBC homepage
    console.log("Step 1: Navigating to BBC homepage...");
    await page.goto("https://www.bbc.co.uk/");
    await page.waitForLoadState("networkidle");

    // Step 2: Click on the Sports link
    console.log("Step 2: Locating and clicking the Sports page...");
    await page.waitForSelector('a[href*="/sport"]');
    await page.click('a[href*="/sport"]');
    await page.waitForLoadState("networkidle");

    // Step 3: Click on the Football link
    console.log("Step 3: Locating and clicking the Football page...");
    await page.waitForSelector('a[href*="/sport/football"]');
    await page.click('a[href*="/sport/football"]');
    await page.waitForLoadState("networkidle");

    // Step 4: Find who last won the Premier League
    console.log("Step 4: Looking for the last Premier League winner...");
    // Look for the "Around the leagues" section and extract the Premier League winner from the image alt text
    const premierLeagueWinner = await page.evaluate(() => {
      // Find all images with alt text containing 'Premier League title' or 'lift Premier League trophy'
      const imgs = Array.from(document.querySelectorAll("img[alt]"));
      for (const img of imgs) {
        const alt = img.getAttribute("alt");
        if (
          alt &&
          /celebrate winning the [0-9]{4}-[0-9]{2} Premier League title/i.test(
            alt
          )
        ) {
          // Example: "Liverpool celebrate winning the 2024-25 Premier League title"
          const match = alt.match(
            /^(.*?) celebrate winning the [0-9]{4}-[0-9]{2} Premier League title/i
          );
          if (match && match[1]) {
            return match[1];
          }
        }
        if (alt && /lift Premier League trophy/i.test(alt)) {
          // Example: "Liverpool lift Premier League trophy"
          const match = alt.match(/^(.*?) lift Premier League trophy/i);
          if (match && match[1]) {
            return match[1];
          }
        }
      }
      return null;
    });
    if (premierLeagueWinner) {
      console.log(`Premier League last winner found: ${premierLeagueWinner}`);
    } else {
      console.log(
        "Could not automatically find the Premier League winner. Please check the Football page."
      );
    }
  } catch (error) {
    console.error("Error during test execution:", error);
  } finally {
    await page.screenshot({ path: "bbc-premierleague-results.png" });
    await browser.close();
    process.exit(0);
  }
}

runScenario();
