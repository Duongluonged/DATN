import { VietJob_DATNTemplatePage } from './app.po';

describe('VietJob_DATN App', function () {
    let page: VietJob_DATNTemplatePage;

    beforeEach(() => {
        page = new VietJob_DATNTemplatePage();
    });

    it('should display message saying app works', () => {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('app works!');
    });
});
