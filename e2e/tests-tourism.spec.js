//@ts-check
import { test, expect } from'@playwright/test';

test('get tourism stats', async ({ page }) => {
    await page.goto('https://sos2223-jul-brb.appspot.com/');
  
    // Click the get started link.
    await page.getByRole('link', { name: 'Gráfico' }).click();
  
    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*graphs/);
  });

 

  test('get uses and integrations', async ({ page }) => {
    await page.goto('https://sos2223-jul-brb.appspot.com/');
  
    // Click the get started link.
    await page.getByRole('link', { name: 'Usos e Integraciones' }).click();
  
    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*integrations/);
  });

 
