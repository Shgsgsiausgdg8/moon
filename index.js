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
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 60000 });

    // گرفتن HTML
    const html = await page.content();

    // گرفتن کوکی‌ها
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
