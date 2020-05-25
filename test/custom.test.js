'use strict';

const mm = require('egg-mock');
const fs = require('mz/fs');
const path = require('path');
const sleep = require('mz-modules/sleep');

describe('test/custom.test.js', () => {
  let app;
  before(() => {
    mm.env('local');
    app = mm.cluster({
      baseDir: 'custom',
    });
    app.debug();
    return app.ready();
  });
  after(() => app.close());
  afterEach(mm.restore);
  // for debounce
  afterEach(() => sleep(500));

  it('should reload with custom detect', async () => {
    let filepath;
    filepath = path.join(__dirname, 'fixtures/custom/app/service/a.js');
    await fs.writeFile(filepath, '');
    await sleep(5000);

    await fs.unlink(filepath);
    app.expect('stdout', /reload worker because .*?a\.js/);

    filepath = path.join(__dirname, 'fixtures/custom/app/service/b.ts');
    await fs.writeFile(filepath, '');
    await sleep(5000);

    await fs.unlink(filepath);
    app.notExpect('stdout', /reload worker because .*?b\.ts/);
  });
});
