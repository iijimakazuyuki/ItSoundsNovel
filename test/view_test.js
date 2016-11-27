const assert = require('chai').assert;
const express = require('express');
const webdriver = require('selenium-webdriver');
const until = webdriver.until;

/**
 * Mocha test timeout.
 */
const TEST_TIMEOUT = 60000;

/**
 * The port listened by the local server for testing.
 */
const TEST_APP_PORT = 3000;

/**
 * The base URL used by the local server for testing.
 */
const BASE_URL = 'http://localhost:' + TEST_APP_PORT + '/test/view/';

/**
 * The name of the browser drivers for testing.
 */
const BROWSER_DRIVERS_NAME = [
    'ie',
    'MicrosoftEdge',
    'chrome',
    'firefox',
];

/**
 * @param browser {string} The browser name of the WebDriver.
 * @returns {Promise} The promised WebDriver building process.
 */
const promiseBuildWebDriver = browser => new Promise(
    (resolve, reject) => new webdriver.Builder()
        .forBrowser(browser)
        .build()
        .then(resolve, reject)
);

describe('ItSoundsNovel View', function () {
    this.timeout(TEST_TIMEOUT);
    let appServer;
    let browserDrivers = new Map();

    before(function () {
        let startAppServer = new Promise(resolve => {
            appServer = express()
                .use(express.static('.'))
                .listen(TEST_APP_PORT, resolve)
        });
        let buildBrowserDrivers = BROWSER_DRIVERS_NAME
            .map(browser => promiseBuildWebDriver(browser)
                .then(driver => browserDrivers.set(browser, driver)));
        return Promise.all(buildBrowserDrivers
            .concat([startAppServer])
        );
    });

    describe('Display a sequence of sentences', function () {

        /**
         * The path to the tested view.
         */
        const PATH = 'display_a_sequence_of_sentences.html';

        /**
         * The first sentence in the sequence.
         */
        const FIRST_SENTENCE = "I am a cat. I don't have my name yet.";

        /**
         * The second sentence in the sequence.
         */
        const SECOND_SENTENCE = "I don't know where I was born.";

        /**
         * The timeout for displaying the first or second sentence.
         */
        const TIMEOUT_FOR_DISPLAYING_SENTENCE = 5000;

        /**
         * @param browserDriverName {string} The browser name ofWebDriver.
         * @returns {Thenable} The WebDriver test sequence.
         */
        const TEST_SEQUENCE_OF = browserDriverName => {
            let driver = browserDrivers.get(browserDriverName);
            return driver.get(BASE_URL + PATH)
                .then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, FIRST_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, SECOND_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                );
        }

        it('should be performed in Firefox', function () {
            return TEST_SEQUENCE_OF('firefox');
        });
        it('should be performed in Chrome', function () {
            return TEST_SEQUENCE_OF('chrome');
        })
        it('should be performed in IE', function () {
            return TEST_SEQUENCE_OF('ie');
        })
        it('should be performed in Edge', function () {
            return TEST_SEQUENCE_OF('MicrosoftEdge');
        })
    });

    after(function () {
        let stopAppServer = new Promise(resolve => {
            appServer.close(resolve);
        });
        let closeBrowserDrivers = Array.from(browserDrivers.values())
            .map(driver => driver.quit());
        return Promise.all(closeBrowserDrivers
            .concat([stopAppServer])
        );
    });
});
