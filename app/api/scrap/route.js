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
    });

    const page = await browser.newPage();

    await page.goto(targetUrl, {
      waitUntil: ["domcontentloaded", "networkidle2"],
      timeout: timeout_sec,
    });

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
