# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blackbox\layout.spec.ts >> [BB-025] Layout should keep core controls usable at 390x844 @P3
- Location: qa\automation\blackbox\layout.spec.ts:11:7

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: locator.click: Test timeout of 90000ms exceeded.
Call log:
  - waiting for getByRole('banner').getByRole('link', { name: 'Catalog', exact: true })

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [aria-hidden] [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - link [ref=e5] [cursor=pointer]:
          - /url: /
          - generic [ref=e9]: SmartCap Studio
        - button [expanded] [ref=e13] [cursor=pointer]:
          - generic [ref=e15]: Toggle menu
    - main [ref=e17]:
      - generic [ref=e18]:
        - generic [ref=e21]:
          - heading [level=1] [ref=e22]:
            - generic [ref=e23]: CROWN YOUR
            - generic [ref=e24]: INDIVIDUALITY.
          - paragraph [ref=e25]: Curated from the finest materials, our collection blends timeless sophistication with modern edge for the discerning wearer.
          - generic [ref=e26]:
            - link [ref=e27] [cursor=pointer]:
              - /url: /katalog
              - text: Discover More
            - link [ref=e28] [cursor=pointer]:
              - /url: https://wa.me/6281234567890?text=Hello%20SmartCap%20Studio%2C%20I%20would%20like%20to%20inquire%20about..
              - text: Inquire on WhatsApp
        - generic [ref=e36]:
          - generic [ref=e37]: SMARTCAP.STUDIO
          - generic [ref=e38]: •
          - generic [ref=e39]: SMARTCAP.STUDIO
          - generic [ref=e40]: •
          - generic [ref=e41]: SMARTCAP.STUDIO
          - generic [ref=e42]: •
          - generic [ref=e43]: SMARTCAP.STUDIO
          - generic [ref=e44]: •
          - generic [ref=e45]: SMARTCAP.STUDIO
          - generic [ref=e46]: •
          - generic [ref=e47]: SMARTCAP.STUDIO
          - generic [ref=e48]: •
          - generic [ref=e49]: SMARTCAP.STUDIO
          - generic [ref=e50]: •
          - generic [ref=e51]: SMARTCAP.STUDIO
          - generic [ref=e52]: •
          - generic [ref=e53]: SMARTCAP.STUDIO
          - generic [ref=e54]: •
          - generic [ref=e55]: SMARTCAP.STUDIO
          - generic [ref=e56]: •
          - generic [ref=e57]: SMARTCAP.STUDIO
          - generic [ref=e58]: •
          - generic [ref=e59]: SMARTCAP.STUDIO
          - generic [ref=e60]: •
      - generic [ref=e62]:
        - heading [level=2] [ref=e64]: COLLECTION
        - generic [ref=e65]:
          - link [ref=e67] [cursor=pointer]:
            - /url: /produk/topi-4-f175b0
            - generic [ref=e70]:
              - generic [ref=e71]:
                - heading [level=3] [ref=e72]: topi 4
                - paragraph [ref=e73]: Rp 65.000
              - button [ref=e74]
          - link [ref=e77] [cursor=pointer]:
            - /url: /produk/topi-3-fe8403
            - generic [ref=e80]:
              - generic [ref=e81]:
                - heading [level=3] [ref=e82]: topi 3
                - paragraph [ref=e83]: Rp 45.000
              - button [ref=e84]
          - link [ref=e87] [cursor=pointer]:
            - /url: /produk/topi-1-3a3963
            - generic [ref=e90]:
              - generic [ref=e91]:
                - heading [level=3] [ref=e92]: topi 1
                - paragraph [ref=e93]: Rp 75.000
              - button [ref=e94]
        - link [ref=e97] [cursor=pointer]:
          - /url: /produk/topi-4-f175b0
          - generic [ref=e100]:
            - heading [level=3] [ref=e101]: topi 4
            - paragraph [ref=e102]: Rp 65.000
        - link [ref=e104] [cursor=pointer]:
          - /url: /katalog
          - text: View Catalog
      - generic [ref=e106]:
        - generic [ref=e107]:
          - generic [ref=e108]: Complimentary Shipping
          - heading [level=2] [ref=e118]: FREE SHIPPING, UNCOMPROMISED STYLE.
          - paragraph [ref=e119]: Enjoy complimentary shipping on all SmartCap Studio orders with no minimum purchase required.
        - link [ref=e121] [cursor=pointer]:
          - /url: /katalog
          - generic [ref=e122]: Shop Now
      - generic [ref=e126]:
        - generic [ref=e127]:
          - generic [ref=e128]: WHY CHOOSE US
          - heading [level=2] [ref=e129]: The Mark of Distinction
          - paragraph [ref=e130]: Crafted with uncompromising precision to elevate your everyday silhouette and define your signature presence.
        - generic [ref=e135]:
          - generic [ref=e136]:
            - heading [level=4] [ref=e137]: Signature Quality
            - paragraph [ref=e138]: Immaculately crafted to define your presence and stand out in any private circle.
          - generic [ref=e139]:
            - button [ref=e140] [cursor=pointer]
            - button [ref=e141] [cursor=pointer]
      - generic [ref=e142]:
        - generic [ref=e143]:
          - heading [level=2] [ref=e145]: OUR BEST SELLING
          - link [ref=e146] [cursor=pointer]:
            - /url: /katalog
            - generic [ref=e147]: EXPLORE ALL CATALOG
        - generic [ref=e152]:
          - link [ref=e154] [cursor=pointer]:
            - /url: /produk/topi-4-f175b0
            - generic [ref=e157]:
              - generic [ref=e158]:
                - heading [level=3] [ref=e159]: topi 4
                - paragraph [ref=e160]: Rp 65.000
              - button [ref=e161]
          - link [ref=e164] [cursor=pointer]:
            - /url: /produk/topi-3-fe8403
            - generic [ref=e167]:
              - generic [ref=e168]:
                - heading [level=3] [ref=e169]: topi 3
                - paragraph [ref=e170]: Rp 45.000
              - button [ref=e171]
          - link [ref=e174] [cursor=pointer]:
            - /url: /produk/topi-1-3a3963
            - generic [ref=e177]:
              - generic [ref=e178]:
                - heading [level=3] [ref=e179]: topi 1
                - paragraph [ref=e180]: Rp 75.000
              - button [ref=e181]
      - generic [ref=e184]:
        - heading [level=3] [ref=e185]: Have a Vision? Let’s Talk!
        - paragraph [ref=e186]: Whether you're curating a private collection or require custom community pieces, our concierge team is at your disposal.
        - link [ref=e188] [cursor=pointer]:
          - /url: https://wa.me/6281234567890?text=Halo%20SmartCap%20Studio%2C%20saya%20ingin%20berdiskusi%20mengenai%20custom%20koleksi%20topi.
          - text: Start WhatsApp Conversation
    - link [ref=e193] [cursor=pointer]:
      - /url: https://wa.me/6281234567890?text=Hello%20SmartCap%20Studio%2C%20I%20would%20like%20to%20inquire%20about%20your%20collection.
      - generic [ref=e197]: Let's Talk!
    - contentinfo [ref=e198]:
      - generic [ref=e199]:
        - generic [ref=e200]:
          - generic [ref=e201]:
            - generic [ref=e206]:
              - heading [level=2] [ref=e207]: SmartCap Studio
              - paragraph [ref=e208]: Crown Your Individuality
            - paragraph [ref=e209]: SmartCap Studio is a premier interactive digital catalog platform curated for premium cap collections.
            - generic [ref=e210]:
              - link [ref=e211] [cursor=pointer]:
                - /url: https://wa.me/6281234567890?text=Hello%20SmartCap%20Studio%2C%20I%20would%20like%20to%20inquire%20about..
              - link [ref=e215] [cursor=pointer]:
                - /url: https://instagram.com
          - generic [ref=e218]:
            - heading [level=3] [ref=e219]: Navigation
            - list [ref=e220]:
              - listitem [ref=e221]:
                - link [ref=e222] [cursor=pointer]:
                  - /url: /
                  - text: Home
              - listitem [ref=e223]:
                - link [ref=e224] [cursor=pointer]:
                  - /url: /katalog
                  - text: Catalog
              - listitem [ref=e225]:
                - link [ref=e226] [cursor=pointer]:
                  - /url: /#about
                  - text: About
              - listitem [ref=e227]:
                - link [ref=e228] [cursor=pointer]:
                  - /url: /cart
                  - text: Cart
              - listitem [ref=e229]:
                - link [ref=e230] [cursor=pointer]:
                  - /url: /login
                  - text: Admin Login
          - generic [ref=e231]:
            - heading [level=3] [ref=e232]: Contact & Location
            - generic [ref=e233]:
              - generic [ref=e234]: Jl. Haji Nawir Husadah II, Jakarta, Indonesia
              - generic [ref=e240]: +62 812-3456-7890
        - generic [ref=e245]: © 2026 SmartCap Studio. All rights reserved. Crown Your Individuality.
  - alert [ref=e246]
  - dialog [ref=e250]:
    - generic [ref=e251]:
      - heading "Navigation" [level=2] [ref=e253]
      - navigation [ref=e254]:
        - link "Home" [active] [ref=e255] [cursor=pointer]:
          - /url: /
        - link "Catalog" [ref=e256] [cursor=pointer]:
          - /url: /katalog
        - link "About" [ref=e257] [cursor=pointer]:
          - /url: /about
        - link "Cart" [ref=e258] [cursor=pointer]:
          - /url: /cart
        - link "Admin Login" [ref=e260] [cursor=pointer]:
          - /url: /login
    - link "Contact WA" [ref=e262] [cursor=pointer]:
      - /url: https://wa.me/6281234567890?text=Hello%20SmartCap%20Studio%2C%20I%20would%20like%20to%20inquire%20about..
    - button "Close" [ref=e263]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { addFromCatalog, cards, catalog, checkpoint, detail, main, openCart } from './helpers';
  3  | 
  4  | test.use({ channel: 'msedge', video: 'off' });
  5  | 
  6  | for (const [index, viewport] of [
  7  |   { width: 1440, height: 900 },
  8  |   { width: 1280, height: 720 },
  9  |   { width: 390, height: 844 },
  10 | ].entries()) {
  11 |   test(`[BB-0${23+index}] Layout should keep core controls usable at ${viewport.width}x${viewport.height} @P3`, async ({ page }, info) => {
  12 |     test.setTimeout(90000);
  13 |     await page.setViewportSize(viewport);
  14 |     async function inspect(label: string) {
  15 |       await page.evaluate(() => document.fonts.ready);
  16 |       const dimensions = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
  17 |       expect.soft(dimensions.scroll, `${label}: horizontal document overflow`).toBeLessThanOrEqual(dimensions.width + 1);
  18 |       await checkpoint(page, info, `${label}-${viewport.width}`);
  19 |     }
  20 |     await page.goto('/');
  21 |     await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  22 |     await inspect('home');
  23 |     if (viewport.width === 390) {
  24 |       await page.getByRole('button', { name: 'Toggle menu' }).click();
  25 |       await inspect('mobile-menu');
> 26 |       await page.getByRole('banner').getByRole('link', { name: 'Catalog', exact: true }).click();
     |                                                                                          ^ Error: locator.click: Test timeout of 90000ms exceeded.
  27 |       await expect(page).toHaveURL(/\/katalog$/);
  28 |       await expect(page.getByRole('banner').getByRole('link', { name: 'Catalog', exact: true })).toBeHidden();
  29 |     }
  30 |     await catalog(page);
  31 |     await page.getByRole('textbox', { name: 'Search', exact: true }).scrollIntoViewIfNeeded();
  32 |     await page.getByRole('button', { name: 'Urutkan Produk' }).click();
  33 |     await expect(page.getByRole('button', { name: 'Price: Low to High', exact: true })).toBeVisible();
  34 |     await inspect('catalog-sort');
  35 |     await page.getByRole('button', { name: 'Price: Low to High', exact: true }).click();
  36 |     await addFromCatalog(page);
  37 |     await expect(cards(page).first()).toBeVisible();
  38 |     await inspect('catalog-added');
  39 |     await openCart(page);
  40 |     const order = page.getByRole('button', { name: /^ORDER \(/ });
  41 |     await expect(order).toBeInViewport();
  42 |     await order.click({ trial: true });
  43 |     await page.getByRole('button', { name: /^Remove / }).click({ trial: true });
  44 |     await inspect('cart');
  45 |     await detail(page);
  46 |     await page.getByRole('button', { name: 'Navy', exact: true }).click();
  47 |     await page.getByRole('button', { name: 'Add to Cart', exact: true }).first().click({ trial: true });
  48 |     await page.getByRole('link', { name: 'Order on WhatsApp' }).click({ trial: true });
  49 |     await inspect('detail');
  50 |     await page.goto('/about');
  51 |     await main(page).getByRole('link', { name: 'EXPLORE COLLECTION' }).click({ trial: true });
  52 |     await inspect('about');
  53 |     await page.goto('/login');
  54 |     await page.getByRole('textbox', { name: 'Email', exact: true }).fill('qa-layout@example.invalid');
  55 |     await page.getByRole('textbox', { name: 'Password', exact: true }).fill('QA-layout-only');
  56 |     await page.getByRole('button', { name: 'Masuk Dashboard' }).click({ trial: true });
  57 |     await inspect('login');
  58 |   });
  59 | }
  60 | 
```