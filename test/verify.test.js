const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { assert } = require("console");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  try {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000/index.html");
  } catch (err) {
    console.error("Error during setup:", err);
  }
});


afterEach(async () => {
  if (browser) {
    await browser.close();
    browser = null;
  }
});


describe('the board class', () => {
  it('should display the kanban columns vertically when the screen is a maximum width of 400px', async () => {
    const styleTags = await page.$$eval('style', (styles) =>
      styles.map((style) => style.innerHTML).join('\n')
    );

    console.log("STYLE CONTENT:\n", styleTags);

    const hasMediaQuery = /@media\s+screen\s+and\s+\(max-width:\s*400px\)\s*{[^}]*\.board\s*{[^}]*flex-direction\s*:\s*column\s*;/.test(styleTags);
    expect(hasMediaQuery).toBe(true);
  });
});
