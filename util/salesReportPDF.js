const ejs = require('ejs');
const puppeteer = require('puppeteer');
const fs = require('fs');

module.exports = {
  generatePdfBuffer: async (orders, startDate, endDate, totalSales) => {
    try {
      const template = fs.readFileSync('util/salesReport.ejs', 'utf-8');
      const html = ejs.render(template, { orders, startDate, endDate, totalSales });

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Set the content of the page with the generated HTML
      await page.setContent(html);

      // Generate PDF buffer
      const pdfBuffer = await page.pdf({
        format: 'Letter',
        landscape: false, // Set to true for landscape orientation
      });

      await browser.close();

      return pdfBuffer;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  },
};
