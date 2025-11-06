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
    const numberFound = await page.$eval('style', (style) => {
  return (/@media[^{]*\(.*max-width.*400px.*\)[^{]*{[^}]*\.board[^{]*{[^}]*flex-direction\s*:\s*column\s*;/.test(style.innerHTML)) ? 1 : 0;
    });
    console.log(await page.$eval('style', (style) => style.innerHTML));

    expect(numberFound).toBe(1);
  });
});