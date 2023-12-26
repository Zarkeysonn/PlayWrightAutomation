const { test, expect, request } = require("@playwright/test");
const { ApiUtils } = require("./utils/ApiUtils");

const loginPayLoad = {
  userEmail: "zarko.djurdjev@automaticity.rs",
  userPassword: "zarkeysonxD1!",
};
const orderPayLoad = {
  orders: [
    { country: "Argentina", productOrderedId: "6581ca399fd99c85e8ee7f45" },
  ],
};

let response;

test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new ApiUtils(apiContext, loginPayLoad); //ovo smo kreirali u apiUtils.js fajlu sa konstruktorom i svime
  response = await apiUtils.createOrder(orderPayLoad);
});

test("Place the order", async ({ page }) => {
  //await page.waitForLoadState("networkidle");
  await page.addInitScript((value) => {
    window.window.localStorage.setItem("token", value);
  }, response.token);
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("button[routerlink*='myorder']").click();
  await page.locator("tbody").waitFor();
  const rows = await page.locator("tbody tr");
  for (let i = 0; i < (await rows.count()); i++) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();
    if (response.orderId.includes(rowOrderId)) {
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }
  const orderIdDetails = await page.locator(".col-text").textContent();
  await page.pause();
  expect(await response.orderId.includes(orderIdDetails)).toBeTruthy();
});
