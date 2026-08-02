// Karma configuration.
//
// Adds a ChromeHeadlessCI launcher so `npm run test:ci` works on build agents and in
// containers, where a sandboxed Chrome cannot start. Interactive `npm test` is unchanged.
// Set CHROME_BIN if Chrome lives somewhere other than the default lookup path.
const fs = require('fs');

if (!process.env.CHROME_BIN) {
  const candidates = ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
  const found = candidates.find(bin => fs.existsSync(bin));
  if (found) {
    process.env.CHROME_BIN = found;
  }
}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {},
      clearContext: false,
    },
    jasmineHtmlReporter: {
      suppressAll: true,
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/kojo-stack'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
      },
    },
    restartOnFileChange: true,
  });
};
