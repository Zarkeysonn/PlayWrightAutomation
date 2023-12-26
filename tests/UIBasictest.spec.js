const { test, expect } = require("@playwright/test");
const exp = require("constants");
const { sign } = require("crypto");
const { emit } = require("process");
const { use } = require("../playwright.config");

test("Browser Context: First Playwright test", async ({ browser }) => {
  //playwright code

  const context = await browser.newContext();
  const page = await context.newPage();
  const userName = page.locator("#username");
  const cardTitles = page.locator(".card-body a");
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  await page.locator("#username").fill("learning");
  await page.locator("[type='password']").fill("learning");
  const signInBtn = page.locator("[name='signin']");
  await signInBtn.click();
  console.log(await page.locator("[style*='block']").textContent());
  await expect(page.locator("[style*='block']")).toContainText("Incorrect");
  await userName.fill("rahulshettyacademy");
  await Promise.all([p]);
  await signInBtn.click();
  //console.log(await cardTitles.first().textContent()); // iphone X
  const allTitles = await cardTitles.allTextContents();
  expect(allTitles).toContain("iphone X");
  console.log(allTitles);
});

test.only("Client App Login", async ({ page }) => {
  const productName = "ZARA COAT 3";
  const products = page.locator(".card-body");
  await page.goto("https://rahulshettyacademy.com/client");
  await expect(page).toHaveTitle("Let's Shop");
  await page.locator("#userEmail").fill("zarko.djurdjev@automaticity.rs");
  await page.locator("#userPassword").fill("zarkeysonxD1!");
  await page.locator("[value='Login']").click();
  //await page.waitForLoadState("networkidle");
  await page.locator(".card-body b").first().waitFor();
  const allTitles = await page.locator(".card-body b").allTextContents();
  console.log(allTitles);
  //Zara Coat 4
  const count = await products.count();
  for (let i = 0; i < count; i++) {
    if ((await products.nth(i).locator("b").textContent()) === productName) {
      //
      await products.nth(i).locator("text= Add To Cart").click();
      break;
    }
  }
  await page.pause();
  await page.locator("[routerlink*='cart']").click();
  await page.pause();
  await page.locator("div li").first().waitFor();
  const bool = await page.locator(`h3:has-text('ZARA COAT 3 ')`).isVisible();
  expect(bool).toBeTruthy();
});

test("UI controls", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  const userName = page.locator("#username");
  const signInBtn = page.locator("[name='signin']");
  const documentLink = page.locator("[href*='documents-request']");
  const dropdown = page.locator("select.form-control");
  await dropdown.selectOption("consult");
  //await page.pause();
  await page.locator(".radiotextsty").last().click();
  await page.locator("#okayBtn").click();
  console.log(await page.locator(".radiotextsty").last().isChecked());
  await expect(page.locator(".radiotextsty").last()).toBeChecked();
  await page.locator("#terms").click();
  await expect(page.locator("#terms")).toBeChecked();
  await page.locator("#terms").uncheck();
  console.log(await page.locator("#terms").isChecked());
  expect(await page.locator("#terms").isChecked()).toBeFalsy();
  await expect(documentLink).toHaveAttribute("class", "blinkingText");
});

test("@Child windows handle", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const userName = page.locator("#username");
  await page.goto("http://rahulshettyacademy.com/loginpagePractise/");
  const documentLink = page.locator("[href*='documents-request']");
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    documentLink.click(),
  ]); //tek kada se sve iz ovih Promisa izvrsi prelazi na sledecu liniju
  const text = await newPage.locator(".red").textContent();

  const arrayText = text.split("@");
  const domain = arrayText[1].split(" ")[0];
  console.log(domain);
  await userName.fill(domain);
  await page.pause();
  console.log(await userName.textContent());
});
