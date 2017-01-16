'use strict';

describe('Friends E2E Tests:', function () {
  describe('Test friends page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/friends');
      expect(element.all(by.repeater('friend in friends')).count()).toEqual(0);
    });
  });
});
