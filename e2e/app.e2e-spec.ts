import { Ng2IntrojsPage } from './app.po';

describe('ng2-introjs App', () => {
  let page: Ng2IntrojsPage;

  beforeEach(() => {
    page = new Ng2IntrojsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
