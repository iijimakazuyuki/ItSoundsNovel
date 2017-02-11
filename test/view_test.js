const assert = require('chai').assert;
const express = require('express');
const webdriver = require('selenium-webdriver');
const until = webdriver.until;

/**
 * Mocha test timeout.
 */
const TEST_TIMEOUT = 90000;

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
        const FIRST_SENTENCE = "I am a cat.\nI don't have my name yet.";

        /**
         * The second sentence in the sequence.
         */
        const SECOND_SENTENCE = "I don't know where I was born.";

        /**
         * The timeout for displaying the first or second sentence.
         * The last letter of the first sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  37 + 500 [ms] = 2350 [ms] < 5000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_SENTENCE = 5000;

        /**
         * The sleep time for clicking next button after waiting
         * for displaying a sentence.
         */
        const SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON = 1000;

        /**
         * @param browserDriverName {string} The browser name of WebDriver.
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
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
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

    describe('Change the display speed', function () {

        /**
         * The path to the tested view.
         */
        const PATH = 'change_the_display_speed.html';

        /**
         * The first sentence in the sequence.
         */
        const FIRST_SENTENCE = "I am a cat. I don't have my name yet.";

        /**
         * The second sentence in the sequence.
         */
        const SECOND_SENTENCE = "I don't know where I was born.";

        /**
         * The third sentence in the sequence.
         */
        const THIRD_SENTENCE =
            "I only remember that I was meowing in dim and wet place.";

        /**
         * The fourth sentence in the sequence.
         */
        const FOURTH_SENTENCE =
            "I saw something called human beings for the first time there.";

        /**
         * The timeout for displaying the first or third sentence.
         * The last letter of the first sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  37 + 500 [ms] = 2350 [ms] < 5000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const DEFAULT_TIMEOUT_FOR_DISPLAYING_SENTENCE = 5000

        /**
         * The timeout for displaying the second or fourth sentence.
         * The last letter of the fourth sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 10 [ms] *  61 + 100 [ms] = 710 [ms] < 1000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_SENTENCE = 1000;

        /**
         * The sleep time for clicking next button after waiting
         * for displaying a sentence.
         */
        const SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON = 1000;

        /**
         * @param browserDriverName {string} The browser name of WebDriver.
         * @returns {Thenable} The WebDriver test sequence.
         */
        const TEST_SEQUENCE_OF = browserDriverName => {
            let driver = browserDrivers.get(browserDriverName);
            let startTime;
            return driver.get(BASE_URL + PATH)
                .then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element => {
                    // Measure the time how long first sentence is displayed.
                    startTime = new Date();
                    return driver.wait(
                        until.elementTextIs(element, FIRST_SENTENCE),
                        DEFAULT_TIMEOUT_FOR_DISPLAYING_SENTENCE
                    );
                }).then(() => {
                    let endTime = new Date();
                    // The first sentence will be displayed more slowly
                    // than the second or fourth sentence.
                    assert.isAbove(
                        endTime - startTime,
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    );
                    return driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON);
                }).then(() =>
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
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element => {
                    // Measure the time how long third sentence is displayed.
                    startTime = new Date();
                    return driver.wait(
                        until.elementTextIs(element, THIRD_SENTENCE),
                        DEFAULT_TIMEOUT_FOR_DISPLAYING_SENTENCE
                    );
                }).then(() => {
                    let endTime = new Date();
                    // The third sentence will be displayed more slowly
                    // than the second or fourth sentence.
                    assert.isAbove(
                        endTime - startTime,
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                    return driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON);
                }).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, FOURTH_SENTENCE),
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

    describe('Play sounds', function () {

        /**
         * The path to the tested view.
         */
        const PATH = 'play_sounds.html';

        /**
         * The first sentence in the sequence.
         */
        const FIRST_SENTENCE = "I don't know where I was born.";

        /**
         * The second sentence in the sequence.
         */
        const SECOND_SENTENCE =
            "I only remember that I was meowing in dim and wet place.";

        /*
         * The third sentence in the sequence.
         */
        const THIRD_SENTENCE =
            "I saw something called human beings for the first time there.";

        /**
         * The timeout for displaying the first or second or third sentence.
         * The last letter of the longest sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  61 + 500 [ms] = 3550 [ms] < 5000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_SENTENCE = 5000;

        /**
         * The sleep time for clicking next button after waiting
         * for displaying a sentence.
         */
        const SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON = 1000;

        /**
         * @param browserDriverName {string} The browser name of WebDriver.
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
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
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
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, THIRD_SENTENCE),
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

    describe('Display a background image', function () {

        /**
         * The path to the tested view.
         */
        const PATH = 'display_a_background_image.html';

        /**
         * The first sentence in the sequence.
         */
        const FIRST_SENTENCE = "I am a cat. I don't have my name yet.";

        /**
         * The second sentence in the sequence.
         */
        const SECOND_SENTENCE = "I don't know where I was born.";

        /**
         * The third sentence in the sequence.
         */
        const THIRD_SENTENCE =
            "I only remember that I was meowing in dim and wet place.";

        /**
         * The fourth sentence in the sequence.
         */
        const FOURTH_SENTENCE =
            "I saw something called human beings for the first time there.";

        /**
         * The timeout for displaying the background image.
         */
        const TIMEOUT_FOR_DISPLAYING_IMAGE = 1000;

        /**
         * The timeout for displaying the background image.
         */
        const LONG_TIMEOUT_FOR_DISPLAYING_IMAGE = 5000;

        /**
         * The timeout for displaying the first sentence.
         * The last letter of the sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  36 + 500 [ms] = 2300 [ms] < 5000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_SENTENCE = 5000;

        /**
         * The timeout for displaying the third and fourth sentence.
         * The last letter of the fourth sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  60 + 500 [ms] = 3500 [ms] < 5000 [ms] (+ LONG_TIMEOUT_FOR_DISPLAYING_IMAGE = timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_IMAGE_AND_SENTENCE = 5000 + LONG_TIMEOUT_FOR_DISPLAYING_IMAGE;

        /**
         * The sleep time for clicking next button after waiting
         * for displaying a sentence.
         */
        const SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON = 1000;

        /**
         * @param browserDriverName {string} The browser name of WebDriver.
         * @returns {Thenable} The WebDriver test sequence.
         */
        const TEST_SEQUENCE_OF = browserDriverName => {
            let driver = browserDrivers.get(browserDriverName);
            return driver.get(BASE_URL + PATH)
                .then(() =>
                    driver.wait(
                        until.elementLocated({ className: 'backgroundImage' }),
                        TIMEOUT_FOR_DISPLAYING_IMAGE
                    )
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, FIRST_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
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
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, THIRD_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_IMAGE_AND_SENTENCE
                    )
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, FOURTH_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_IMAGE_AND_SENTENCE
                    )
                ).then(() =>
                    driver.findElements({ className: 'backgroundImage' })
                ).then(elements => {
                    assert.lengthOf(elements, 0);
                });
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

    describe('Play background music', function () {

        /**
         * The path to the tested view.
         */
        const PATH = 'play_background_music.html';

        /**
         * The first sentence in the sequence.
         */
        const FIRST_SENTENCE = "I am a cat. I don't have my name yet.";

        /**
         * The second sentence in the sequence.
         */
        const SECOND_SENTENCE = "I don't know where I was born.";

        /**
         * The third sentence in the sequence.
         */
        const THIRD_SENTENCE =
            "I only remember that I was meowing in dim and wet place.";

        /**
         * The sleep time for clicking next button after waiting
         * for displaying a sentence.
         */
        const SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON = 1000;

        /**
         * The timeout for displaying the first or second or third sentence.
         * The last letter of the longest sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  55 + 500 [ms] = 3250 [ms] < 5000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_SENTENCE = 5000;

        /**
         * @param browserDriverName {string} The browser name of WebDriver.
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
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
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
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, THIRD_SENTENCE),
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

    describe('Display images', function () {

        /**
         * The path to the tested view.
         */
        const PATH = 'display_images.html';

        /**
         * The first sentence in the sequence.
         */
        const FIRST_SENTENCE = "I am a cat. I don't have my name yet.";

        /**
         * The second sentence in the sequence.
         */
        const SECOND_SENTENCE = "I don't know where I was born.";

        /**
         * The third sentence in the sequence.
         */
        const THIRD_SENTENCE =
            "I only remember that I was meowing in dim and wet place.";

        /**
         * The timeout for displaying the background image.
         */
        const TIMEOUT_FOR_DISPLAYING_IMAGE = 1000;

        /**
         * The timeout for displaying the third sentence.
         * The last letter of the sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  56 + 500 [ms] = 3300 [ms] < 5000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_SENTENCE = 5000;

        /**
         * The sleep time for clicking next button after waiting
         * for displaying a sentence.
         */
        const SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON = 1000;

        /**
         * @param browserDriverName {string} The browser name of WebDriver.
         * @returns {Thenable} The WebDriver test sequence.
         */
        const TEST_SEQUENCE_OF = browserDriverName => {
            let driver = browserDrivers.get(browserDriverName);
            return driver.get(BASE_URL + PATH)
                .then(() =>
                    driver.wait(
                        until.elementLocated({ id: 'cat1' }),
                        TIMEOUT_FOR_DISPLAYING_IMAGE
                    )
                ).then(() =>
                    driver.wait(
                        until.elementLocated({ id: 'cat2' }),
                        TIMEOUT_FOR_DISPLAYING_IMAGE
                    )
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, FIRST_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
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
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, THIRD_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.findElements({ id: 'cat1' })
                ).then(elements => {
                    assert.lengthOf(elements, 0);
                });
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

    describe('Load another scenario', function () {

        /**
         * The path to the tested view.
         */
        const PATH = 'load_another_scenario.html';

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
         * The last letter of the first sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  37 + 500 [ms] = 2350 [ms] < 5000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_SENTENCE = 5000;

        /**
         * The sleep time for clicking next button after waiting
         * for displaying a sentence.
         */
        const SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON = 1000;

        /**
         * @param browserDriverName {string} The browser name of WebDriver.
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
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
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

    describe('Save and load progress', function () {

        /**
         * The path to the tested view.
         */
        const PATH = 'save_and_load_progress.html';

        /**
         * The first sentence in the sequence.
         */
        const FIRST_SENTENCE = "I am a cat. I don't have my name yet.";

        /**
         * The second sentence in the sequence.
         */
        const SECOND_SENTENCE = "I don't know where I was born.";

        /**
         * The third sentence in the sequence.
         */
        const THIRD_SENTENCE =
            "I only remember that I was meowing in dim and wet place.";

        /**
         * The timeout for displaying the sentences.
         * The last letter of the third sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  56 + 500 [ms] = 3300 [ms] < 5000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_SENTENCE = 5000;

        /**
         * The sleep time for clicking next button after waiting
         * for displaying a sentence.
         */
        const SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON = 1000;

        /**
         * @param browserDriverName {string} The browser name of WebDriver.
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
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
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
                ).then(() =>
                    driver.findElement({ id: 'saveButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.get(BASE_URL + PATH)
                ).then(() =>
                    driver.findElement({ id: 'loadButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, SECOND_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, THIRD_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.findElement({ id: 'saveButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.get(BASE_URL + PATH)
                ).then(() =>
                    driver.findElement({ id: 'loadButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, THIRD_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.findElements({ id: 'cat1' })
                ).then(elements => {
                    assert.lengthOf(elements, 0);
                });
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

    describe('Wait for seconds', function () {

        /**
         * The path to the tested view.
         */
        const PATH = 'wait_for_seconds.html';

        /**
         * The first sentence in the sequence.
         */
        const FIRST_SENTENCE = "I am a cat. I don't have my name yet.";

        /**
         * The second sentence in the sequence.
         */
        const SECOND_SENTENCE = "I don't know where I was born.";

        /**
         * The seconds to wait.
         */
        const WAIT_SECONDS = 5000;

        /**
         * The timeout for displaying the first or second sentence.
         * The last letter of the first sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  37 + 500 [ms] = 2350 [ms] < 5000 [ms] (+ WAIT_SECONDS = timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_SENTENCE = 10000;

        /**
         * The sleep time for clicking next button after waiting
         * for displaying a sentence.
         */
        const SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON = 1000;

        /**
         * @param browserDriverName {string} The browser name of WebDriver.
         * @returns {Thenable} The WebDriver test sequence.
         */
        const TEST_SEQUENCE_OF = browserDriverName => {
            let driver = browserDrivers.get(browserDriverName);
            let startTime;
            return driver.get(BASE_URL + PATH)
                .then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element => {
                    // Measure the time how long first sentence is displayed.
                    startTime = new Date();
                    return driver.wait(
                        until.elementTextIs(element, FIRST_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    );
                }).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
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
                ).then(() => {
                    let endTime = new Date();
                    // The first sentence will be displayed more slowly
                    // than the second or fourth sentence.
                    assert.isAbove(
                        endTime - startTime,
                        WAIT_SECONDS
                    );
                });
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
