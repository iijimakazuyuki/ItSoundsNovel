It Sounds Novel
================================================================================

Sound Novel Maker.

Usage
--------------------------------------------------------------------------------

1. Create your [scenario](docs/scenario/README.md).
1. Make your [HTML using `it-sounds-novel.js`](docs/view/README.md).
1. Publish your HTML to web.

Build
--------------------------------------------------------------------------------

Command

```text
npm install
npm run build
```

will make `it-sounds-novel.js`.

Test
--------------------------------------------------------------------------------

Command

```text
npm install
npm run test
```

will do

- unit tests.
- end-to-end tests (using Selenium).

End-to-end tests work on Windows.

End-to-end tests require

- `it-sounds-novel.js` (before test, build).
- Browsers:
  - Mozilla Firefox
  - Google Chrome
  - Internet Explorer
  - Microsoft Edge
- PATH to
  - geckodriver.
  - chromedriver.
  - IEDriverServer.
  - MicrosoftWebDriver.
- Unused port 3000.
