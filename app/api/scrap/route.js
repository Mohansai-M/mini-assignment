import puppeteer from "puppeteer";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl || !/^https?:\/\/.+/i.test(targetUrl)) {
    return Response.json({ error: "Invalid URL" }, { status: 400 });
  }

  const timeout_sec = 20000; 
  let browser;
  let isTimedOut = false;

  const timeout = setTimeout(() => {
    isTimedOut = true;
  }, timeout_sec);

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    const customAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36";

    await page.setUserAgent(customAgent);
    
    const maxAttempts = 2;
    const navigationOptions = {
      waitUntil: ["domcontentloaded", "networkidle2"],
      timeout: timeout_sec,
    };

    for (let i = 0; i < maxAttempts; i++) {
      try {
        await page.goto(targetUrl, navigationOptions);
        break;
      } catch (err) {
        if (i === maxAttempts - 1) {
          throw new Error(
            `Failed to navigate to ${targetUrl} after ${maxAttempts} attempts.`
          );
        }
      }
    }

    if (isTimedOut) {
      return Response.json({ error: "Timeout" }, { status: 504 });
    }

    const data = await page.evaluate(() => {
      const title = document.title || null;
      const metaDescription =
        document.querySelector('meta[name="description"]')?.content ||
        document.querySelector('meta[property="og:description"]')?.content ||
        null;

      const h1Tags = Array.from(document.querySelectorAll("h1")).map((el) =>
        el.textContent.trim()
      );

      return { title, metaDescription, h1: h1Tags };
    });

    clearTimeout(timeout);
    return Response.json({ ...data, status: 200 }, { status: 200 });
  } catch (error) {
    clearTimeout(timeout);
    if (isTimedOut || error.message.includes("timeout")) {
      return Response.json({ error: "Timeout" }, { status: 504 });
    }
    return Response.json(
      { error: "Failed to scrape page", details: error.message },
      { status: 500 }
    );
  } finally {
    clearTimeout(timeout);
    if (browser) await browser.close();
  }
}
