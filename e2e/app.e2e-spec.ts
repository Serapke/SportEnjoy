import { TestasPage } from './app.po';

describe('testas App', function() {
  let page: TestasPage;

  beforeEach(() => {
    page = new TestasPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
