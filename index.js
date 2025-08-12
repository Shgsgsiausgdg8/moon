// index.js
import express from "express";
import puppeteer from "puppeteer";

const app = express();

app.get("/render", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: "Missing ?url=" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome"
    });

    const page = await browser.newPage();

    // اگه خواستی هدر مرورگر واقعی بزاری
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/118.0.5993.90 Safari/537.36"
    );

    await page.goto(targetUrl, {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    const html = await page.content();
    const cookies = await page.cookies();

    await browser.close();

    res.json({ html, cookies });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(3000, () => {
  console.log("Browser proxy running on port 3000");
});
