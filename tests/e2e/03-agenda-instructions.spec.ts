import { test, expect } from "@playwright/test";

/**
 * 03 — Agenda: instructions dialog interactivity
 *
 * The "agenda — instruções" dialog at the top of /agenda/ has two
 * buttons:
 *   - Imprimir → calls window.print()
 *   - OK → scrolls back to the top of the page
 *
 * These are now wired through `<AgendaInstructions>` (a client
 * component). The tests verify the side effects, not the markup.
 */

test.describe("03 — Agenda: instruções dialog", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?skipGate=1");
    await page.goto("/agenda/");
  });

  test("'Imprimir' button triggers window.print()", async ({ page }) => {
    // Spy on window.print so we can assert it gets called.
    await page.evaluate(() => {
      window.__printCalled = 0;
      window.print = () => {
        window.__printCalled++;
      };
    });

    await page
      .getByRole("button", { name: /imprimir/i })
      .first()
      .click();

    const printCount = await page.evaluate(() => window.__printCalled);
    expect(printCount).toBe(1);
  });

  test("'OK' button scrolls to the top of the agenda page", async ({
    page,
  }) => {
    // Scroll down first so we can measure a real scroll change
    await page.evaluate(() => window.scrollTo(0, 600));
    const beforeY = await page.evaluate(() => window.scrollY);
    expect(beforeY).toBeGreaterThan(100);

    // Click OK — the agenda-instruções one (not the home-properties one).
    // Use first visible OK that's not inside an aria-label.
    const okButton = page.getByRole("button", { name: /^OK$/ }).first();
    await okButton.click();

    // Allow smooth scroll to settle (CSS smooth scroll)
    await page.waitForTimeout(800);
    const afterY = await page.evaluate(() => window.scrollY);
    expect(afterY).toBeLessThan(beforeY);
  });
});
