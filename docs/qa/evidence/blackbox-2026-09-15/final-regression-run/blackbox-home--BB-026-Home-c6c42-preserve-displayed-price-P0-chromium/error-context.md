# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blackbox\home.spec.ts >> [BB-026] Home collection and best selling adds should preserve displayed price @P0
- Location: qa\automation\blackbox\home.spec.ts:6:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('main').getByRole('link').filter({ has: getByRole('heading', { level: 3 }) }).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('main').getByRole('link').filter({ has: getByRole('heading', { level: 3 }) }).first() with timeout 5000ms
  - waiting for getByRole('main').getByRole('link').filter({ has: getByRole('heading', { level: 3 }) }).first()

```

```yaml
- banner:
  - link "SmartCap Studio":
    - /url: /
    - img
    - text: SmartCap Studio
  - navigation:
    - link "Home":
      - /url: /
    - link "Catalog":
      - /url: /katalog
    - link "About":
      - /url: /about
    - link "Cart":
      - /url: /cart
  - link "Admin":
    - /url: /login
- main:
  - heading "CROWN YOUR INDIVIDUALITY." [level=1]
  - paragraph: Curated from the finest materials, our collection blends timeless sophistication with modern edge for the discerning wearer.
  - link "Discover More":
    - /url: /katalog
  - link "Inquire on WhatsApp":
    - /url: https://wa.me/6281234567890?text=Hello%20SmartCap%20Studio%2C%20I%20would%20like%20to%20inquire%20about..
  - img "SmartCap Hero Showcase"
  - text: SMARTCAP.STUDIO • SMARTCAP.STUDIO • SMARTCAP.STUDIO • SMARTCAP.STUDIO • SMARTCAP.STUDIO • SMARTCAP.STUDIO • SMARTCAP.STUDIO • SMARTCAP.STUDIO • SMARTCAP.STUDIO • SMARTCAP.STUDIO • SMARTCAP.STUDIO • SMARTCAP.STUDIO •
  - heading "COLLECTIONS" [level=2]
  - link "View Catalog":
    - /url: /katalog
  - text: Complimentary Shipping
  - heading "FREE SHIPPING, UNCOMPROMISED STYLE." [level=2]
  - paragraph: Enjoy complimentary shipping on all SmartCap Studio orders with no minimum purchase required.
  - link "Shop Now":
    - /url: /katalog
  - text: WHY CHOOSE US
  - heading "The Mark of Distinction" [level=2]
  - paragraph: Crafted with uncompromising precision to elevate your everyday silhouette and define your signature presence.
  - heading "Uncompromising Craftsmanship" [level=3]
  - paragraph: Sourced from the finest materials to elevate your everyday silhouette with enduring structure and luxury.
  - heading "Signature Quality" [level=3]
  - paragraph: Immaculately crafted to define your presence and stand out in any private circle.
  - heading "OUR BEST SELLING" [level=2]
  - link "EXPLORE ALL CATALOG":
    - /url: /katalog
  - heading "Have a Vision? Let’s Talk!" [level=3]
  - paragraph: Whether you're curating a private collection or require custom community pieces, our concierge team is at your disposal.
  - link "Start WhatsApp Conversation":
    - /url: https://wa.me/6281234567890?text=Halo%20SmartCap%20Studio%2C%20saya%20ingin%20berdiskusi%20mengenai%20custom%20koleksi%20topi.
- link "Let's Talk!":
  - /url: https://wa.me/6281234567890?text=Hello%20SmartCap%20Studio%2C%20I%20would%20like%20to%20inquire%20about%20your%20collection.
  - img
  - text: Let's Talk!
- contentinfo:
  - img
  - heading "SmartCap Studio" [level=2]
  - paragraph: Crown Your Individuality
  - paragraph: SmartCap Studio is a premier interactive digital catalog platform curated for premium cap collections.
  - link "WhatsApp":
    - /url: https://wa.me/6281234567890?text=Hello%20SmartCap%20Studio%2C%20I%20would%20like%20to%20inquire%20about..
    - img
  - link "Instagram":
    - /url: https://instagram.com
    - img
  - heading "Navigation" [level=3]
  - list:
    - listitem:
      - link "Home":
        - /url: /
    - listitem:
      - link "Catalog":
        - /url: /katalog
    - listitem:
      - link "About":
        - /url: /#about
    - listitem:
      - link "Cart":
        - /url: /cart
    - listitem:
      - link "Admin Login":
        - /url: /login
  - heading "Contact & Location" [level=3]
  - img
  - text: Jl. Haji Nawir Husadah II, Jakarta, Indonesia
  - img
  - text: +62 812-3456-7890 © 2026 SmartCap Studio. All rights reserved. Crown Your Individuality.
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { cards, cardData, checkpoint, main, openCart, orderText, rupiah } from './helpers';
  3  | 
  4  | test.use({ channel:'msedge', video:'off', viewport:{width:1440,height:900} });
  5  | 
  6  | test('[BB-026] Home collection and best selling adds should preserve displayed price @P0', async ({page},info) => {
  7  |   test.setTimeout(60000);
  8  |   for(const section of ['collection','best-selling']) {
  9  |     await page.goto('/');
> 10 |     await expect(cards(page).first()).toBeVisible();
     |                                       ^ Error: expect(locator).toBeVisible() failed
  11 |     // Collection is the first product-card group; Best Selling is the last.
  12 |     // Both locations were observed in the live Home accessibility snapshot.
  13 |     const card = section === 'collection' ? cards(page).first() : cards(page).last();
  14 |     const item = await cardData(card);
  15 |     await card.getByRole('button',{name:'Add to Cart',exact:true}).click();
  16 |     await expect(page.getByRole('link',{name:'View Cart',exact:true})).toBeVisible();
  17 |     await openCart(page);
  18 |     await expect(page.getByRole('button',{name:`Remove ${item.name}`,exact:true})).toHaveCount(1);
  19 |     await checkpoint(page,info,`${section}-cart-price`);
  20 |     await info.attach(`${section}-displayed-card`,{body:JSON.stringify(item),contentType:'application/json'});
  21 |     await expect.soft(main(page).getByText(`Total: ${rupiah(item.price)}`,{exact:true})).toBeVisible();
  22 |     await page.reload();
  23 |     await expect.soft(main(page).getByText(`Total: ${rupiah(item.price)}`,{exact:true})).toBeVisible();
  24 |     const text = await orderText(page,info);
  25 |     expect(text).toContain(item.name);
  26 |     expect.soft(text).toContain(rupiah(item.price));
  27 |     await page.getByRole('button',{name:`Remove ${item.name}`,exact:true}).click();
  28 |     await expect(page.getByText('Your Cart is Empty',{exact:true})).toBeVisible();
  29 |   }
  30 | });
  31 | 
  32 | test('[BB-027] Mobile home feature controls should change the visible slide @P2', async ({page},info) => {
  33 |   await page.setViewportSize({width:390,height:844});
  34 |   await page.goto('/');
  35 |   await page.getByRole('button',{name:'Feature 1',exact:true}).click();
  36 |   await expect(main(page).getByRole('heading',{level:4})).toHaveText('Uncompromising Craftsmanship');
  37 |   await page.getByRole('button',{name:'Feature 2',exact:true}).click();
  38 |   await expect(main(page).getByRole('heading',{level:4})).toHaveText('Signature Quality');
  39 |   await checkpoint(page,info,'home-feature-two');
  40 |   await page.getByRole('button',{name:'Feature 1',exact:true}).click();
  41 |   await expect(main(page).getByRole('heading',{level:4})).toHaveText('Uncompromising Craftsmanship');
  42 | });
  43 | 
```