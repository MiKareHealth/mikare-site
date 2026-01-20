import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  "http://localhost:4322/",
  "http://localhost:4322/our-journey",
  "http://localhost:4322/mikareapp",
  "http://localhost:4322/pricing",
  "http://localhost:4322/help",
  "http://localhost:4322/contact",
  "http://localhost:4322/privacy",
  "http://localhost:4322/terms",
];

const main = async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const url of pages) {
    await page.goto(url, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page }).analyze();

    const violations = results.violations.map(v => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.length,
      targets: v.nodes.map(n => n.target[0]).slice(0, 3).join(', '),
    }));

    console.log("\n==", url);
    console.table(violations);

    // Show detailed info for remaining issues
    for (const v of results.violations) {
      console.log(`  ${v.id}:`, v.nodes.map(n => n.target[0]).join(', '));
      // Show more detail for color-contrast
      if (v.id === 'color-contrast') {
        v.nodes.forEach(n => {
          console.log('    Details:', n.failureSummary);
          console.log('    HTML:', n.html?.substring(0, 100));
        });
      }
    }
  }

  await browser.close();
};

main();
