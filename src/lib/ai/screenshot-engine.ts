import { chromium, Browser, Page } from "playwright";
import path from "path";
import fs from "fs/promises";
import type { Screenshot } from "@/types";

interface CaptureOptions {
  url: string;
  outputDir: string;
  viewport?: { width: number; height: number };
  waitFor?: number;
  featureTags?: string[];
}

const featureDetectionPatterns: Record<string, RegExp[]> = {
  dashboard: [/dashboard/i, /analytics/i, /stats/i, /metrics/i],
  authentication: [/login/i, /sign.?up/i, /auth/i, /register/i],
  "ai-chatbot": [/chat/i, /ai/i, /assistant/i, /bot/i, /gpt/i],
  payment: [/payment/i, /pricing/i, /subscription/i, /billing/i, /checkout/i],
  calendar: [/calendar/i, /schedule/i, /booking/i, /event/i],
  crm: [/crm/i, /customer/i, /contact/i, /lead/i],
  automation: [/automation/i, /workflow/i, /trigger/i, /action/i],
  "admin-panel": [/admin/i, /settings/i, /config/i, /manage/i],
  ecommerce: [/shop/i, /store/i, /product/i, /cart/i, /order/i],
  analytics: [/analytics/i, /chart/i, /graph/i, /report/i],
};

export async function captureScreenshots(
  products: { url: string; name?: string }[]
): Promise<Screenshot[]> {
  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const screenshots: Screenshot[] = [];

    for (const product of products) {
      const captured = await captureProductScreenshots(browser!, product.url);
      screenshots.push(...captured.map((s) => ({ ...s, matchedProductId: product.url })));
    }

    return screenshots;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function captureProductScreenshots(
  browser: Browser,
  url: string
): Promise<Omit<Screenshot, "matchedProductId">[]> {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
  });

  const screenshots: Omit<Screenshot, "matchedProductId">[] = [];

  try {
    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    await page.waitForTimeout(2000);

    const homepagePath = path.join(
      process.cwd(),
      "public",
      "screenshots",
      `${crypto.randomUUID()}.png`
    );
    await fs.mkdir(path.dirname(homepagePath), { recursive: true });
    await page.screenshot({
      path: homepagePath,
      fullPage: false,
    });

    const featureTags = await detectFeatures(page);
    screenshots.push({
      id: crypto.randomUUID(),
      url: homepagePath,
      imagePath: homepagePath,
      featureTags,
      createdAt: new Date(),
    });

    const navLinks = await findFeaturePaths(page);
    for (const link of navLinks.slice(0, 3)) {
      try {
        await page.goto(link, { waitUntil: "networkidle", timeout: 15000 });
        await page.waitForTimeout(1500);

        const featurePath = path.join(
          process.cwd(),
          "public",
          "screenshots",
          `${crypto.randomUUID()}.png`
        );
        await page.screenshot({
          path: featurePath,
          fullPage: false,
        });

        screenshots.push({
          id: crypto.randomUUID(),
          url: featurePath,
          imagePath: featurePath,
          featureTags: await detectFeatures(page),
          createdAt: new Date(),
        });
      } catch {
        continue;
      }
    }
  } catch (error) {
    console.error(`Failed to capture screenshots for ${url}:`, error);
  } finally {
    await page.close();
  }

  return screenshots;
}

async function detectFeatures(page: Page): Promise<string[]> {
  const features: string[] = [];

  const content = await page.content().catch(() => "");
  const url = page.url();

  for (const [feature, patterns] of Object.entries(featureDetectionPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(content) || pattern.test(url)) {
        features.push(feature);
        break;
      }
    }
  }

  return features.length > 0 ? features : ["general"];
}

async function findFeaturePaths(page: Page): Promise<string[]> {
  const paths: string[] = [];
  const baseUrl = new URL(page.url());

  try {
    const hrefs = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a[href]"));
      return links
        .map((a) => (a as HTMLAnchorElement).href)
        .filter(
          (href) =>
            href &&
            (href.includes("/pricing") ||
              href.includes("/features") ||
              href.includes("/about") ||
              href.includes("/demo"))
        );
    });

    for (const href of hrefs) {
      try {
        const parsed = new URL(href);
        if (parsed.hostname === baseUrl.hostname) {
          paths.push(href);
        }
      } catch {
        continue;
      }
    }
  } catch {
    // Ignore errors
  }

  return paths;
}

export async function captureSingleScreenshot(
  options: CaptureOptions
): Promise<string | null> {
  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage({
      viewport: options.viewport || { width: 1280, height: 720 },
    });

    await page.goto(options.url, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    if (options.waitFor) {
      await page.waitForTimeout(options.waitFor);
    }

    const filename = `${crypto.randomUUID()}.png`;
    const filepath = path.join(options.outputDir, filename);
    await fs.mkdir(options.outputDir, { recursive: true });

    await page.screenshot({
      path: filepath,
      fullPage: true,
    });

    await page.close();
    return filepath;
  } catch (error) {
    console.error("Screenshot capture failed:", error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}