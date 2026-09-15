import { test, expect } from '@playwright/test';
import { cards, cardData, checkpoint, main, openCart, orderText, rupiah } from './helpers';

test.use({ channel:'msedge', video:'off', viewport:{width:1440,height:900} });

test('[BB-026] Home collection and best selling adds should preserve displayed price @P0', async ({page},info) => {
  test.setTimeout(60000);
  for(const section of ['collection','best-selling']) {
    await page.goto('/');
    await expect(cards(page).first()).toBeVisible();
    // Collection is the first product-card group; Best Selling is the last.
    // Both locations were observed in the live Home accessibility snapshot.
    const card = section === 'collection' ? cards(page).first() : cards(page).last();
    const item = await cardData(card);
    await card.getByRole('button',{name:'Add to Cart',exact:true}).click();
    await expect(page.getByRole('link',{name:'View Cart',exact:true})).toBeVisible();
    await openCart(page);
    await expect(page.getByRole('button',{name:`Remove ${item.name}`,exact:true})).toHaveCount(1);
    await checkpoint(page,info,`${section}-cart-price`);
    await info.attach(`${section}-displayed-card`,{body:JSON.stringify(item),contentType:'application/json'});
    await expect.soft(main(page).getByText(`Total: ${rupiah(item.price)}`,{exact:true})).toBeVisible();
    await page.reload();
    await expect.soft(main(page).getByText(`Total: ${rupiah(item.price)}`,{exact:true})).toBeVisible();
    const text = await orderText(page,info);
    expect(text).toContain(item.name);
    expect.soft(text).toContain(rupiah(item.price));
    await page.getByRole('button',{name:`Remove ${item.name}`,exact:true}).click();
    await expect(page.getByText('Your Cart is Empty',{exact:true})).toBeVisible();
  }
});

test('[BB-027] Mobile home feature controls should change the visible slide @P2', async ({page},info) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await page.getByRole('button',{name:'Feature 1',exact:true}).click();
  await expect(main(page).getByRole('heading',{level:4})).toHaveText('Uncompromising Craftsmanship');
  await page.getByRole('button',{name:'Feature 2',exact:true}).click();
  await expect(main(page).getByRole('heading',{level:4})).toHaveText('Signature Quality');
  await checkpoint(page,info,'home-feature-two');
  await page.getByRole('button',{name:'Feature 1',exact:true}).click();
  await expect(main(page).getByRole('heading',{level:4})).toHaveText('Uncompromising Craftsmanship');
});
