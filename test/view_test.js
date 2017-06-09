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
         * The ruby for the first sentence in the sequence.
         */
        const RUBY_FOR_FIRST_SENTENCE = "Namae wa mada nai.";

        /**
         * The second sentence in the sequence.
         */
        const SECOND_SENTENCE = "I don't know where I was born.";

        /**
         * The third and fourth sentences in the sequence.
         */
        const THIRD_AND_FOURTH_SENTENCES =
            "I only remember that I was meowing in dim and wet place."
            + " I saw something called human beings for the first time there.";

        /**
         * The timeout for displaying the first or second sentence.
         * The last letter of the first sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  37 + 500 [ms] = 2350 [ms] < 5000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_SENTENCE = 5000;

        /**
         * The timeout for displaying the third sentence and tgfourth sentence.
         * The last letter of the third sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  56 + 500 [ms] = 3300 [ms],
         * and the last letter of the fourth sentence will be displayed in
         *   3300 [ms] + auto [ms] + delay [ms] * #letters + duration [ms]
         *   = 3300 [ms] + 100 [ms] + 50 [ms] *  61 + 500 [ms]
         *   = 6950 [ms] < 10000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_THIRD_AND_FOURTH_SENTENCES = 10000;

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
                    driver.wait(until.elementTextContains(
                        element, FIRST_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
                ).then(element =>
                    driver.wait(until.elementTextContains(
                        element, RUBY_FOR_FIRST_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, SECOND_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, THIRD_AND_FOURTH_SENTENCES
                    ), TIMEOUT_FOR_DISPLAYING_THIRD_AND_FOURTH_SENTENCES)
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
                    return driver.wait(until.elementTextIs(
                        element, FIRST_SENTENCE
                    ), DEFAULT_TIMEOUT_FOR_DISPLAYING_SENTENCE);
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
                    driver.wait(until.elementTextIs(
                        element, SECOND_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
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
                    return driver.wait(until.elementTextIs(
                        element, THIRD_SENTENCE
                    ), DEFAULT_TIMEOUT_FOR_DISPLAYING_SENTENCE);
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
                    driver.wait(until.elementTextIs(
                        element, FOURTH_SENTENCE
                    ), DEFAULT_TIMEOUT_FOR_DISPLAYING_SENTENCE)
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
                    driver.wait(until.elementTextIs(
                        element, FIRST_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, SECOND_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, THIRD_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
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
         *   = 50 [ms] *  60 + 500 [ms] = 3500 [ms] < 5000 [ms]
         *     (+ LONG_TIMEOUT_FOR_DISPLAYING_IMAGE = timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_IMAGE_AND_SENTENCE
            = 5000 + LONG_TIMEOUT_FOR_DISPLAYING_IMAGE;

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
                    driver.wait(until.elementLocated(
                        { className: 'backgroundImage' }
                    ), TIMEOUT_FOR_DISPLAYING_IMAGE)
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, FIRST_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, SECOND_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, THIRD_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_IMAGE_AND_SENTENCE)
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, FOURTH_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_IMAGE_AND_SENTENCE)
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
                    driver.wait(until.elementTextIs(
                        element, FIRST_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, SECOND_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, THIRD_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
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
                    driver.wait(until.elementLocated(
                        { id: 'cat1' }
                    ), TIMEOUT_FOR_DISPLAYING_IMAGE)
                ).then(() =>
                    driver.wait(until.elementLocated(
                        { id: 'cat2' }
                    ), TIMEOUT_FOR_DISPLAYING_IMAGE)
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, FIRST_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, SECOND_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, THIRD_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
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
                    driver.wait(until.elementTextIs(
                        element, FIRST_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, SECOND_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
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
         * The seconds and third sentences in the sequence.
         */
        const SECOND_AND_THIRD_SENTENCES =
            "I don't know where I was born."
            + " I only remember that I was meowing in dim and wet place.";

        /**
         * The a status message for flag1.
         */
        const FLAG1_STATUS_MESSAGE = "flag1 is";

        /**
         * The a status message for flag2.
         */
        const FLAG2_STATUS_MESSAGE = "flag2 is set";

        /**
         * The a status message for flag3.
         */
        const FLAG3_STATUS_MESSAGE = "flag3 is set";

        /**
         * The timeout for displaying the sentences.
         * The last letter of the third sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  56 + 500 [ms] = 3300 [ms] < 5000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_SENTENCE = 5000;

        /**
         * The sleep time for clicking the next button, the save button or
         * the load button after waiting for displaying a sentence.
         */
        const SLEEP_TIME_FOR_CLICKING_BUTTONS = 1000;

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
                    driver.wait(until.elementTextIs(
                        element, FIRST_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
                ).then(() =>
                    driver.findElement({ id: 'saveButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.get(BASE_URL + PATH)
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_BUTTONS)
                ).then(() =>
                    driver.findElement({ id: 'loadButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, FIRST_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
                ).then(() =>
                    driver.findElement({ id: 'statusWindow' })
                ).then(element =>
                    driver.wait(until.elementTextContains(
                        element, FLAG1_STATUS_MESSAGE
                    ))
                ).then(() =>
                    driver.findElement({ id: 'anotherStatusWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, FLAG3_STATUS_MESSAGE
                    ))
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_BUTTONS)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(element, SECOND_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
                ).then(() =>
                    driver.findElement({ id: 'saveButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.get(BASE_URL + PATH)
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_BUTTONS)
                ).then(() =>
                    driver.findElement({ id: 'loadButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, SECOND_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
                ).then(() =>
                    driver.findElement({ id: 'statusWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, FLAG2_STATUS_MESSAGE
                    ))
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_BUTTONS)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, SECOND_AND_THIRD_SENTENCES
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
                ).then(() =>
                    driver.findElement({ id: 'saveButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.get(BASE_URL + PATH)
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_BUTTONS)
                ).then(() =>
                    driver.findElement({ id: 'loadButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, SECOND_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
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
         * The seconds to sleep in the sentence.
         */
        const SLEEP_TIME = 1000;

        /**
         * The seconds to wait.
         */
        const WAIT_SECONDS = 5000;

        /**
         * The timeout for displaying the first sentence.
         * The last letter of the first sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] * 37 + 500 [ms] = 2350 [ms] < 5000 [ms]
         *     (+ SLEEP_TIME = timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_FIRST_SENTENCE = 5000 + SLEEP_TIME;

        /**
         * The timeout for displaying the second sentence.
         * The last letter of the second sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] * 30 + 500 [ms] = 2000 [ms] < 5000 [ms]
         *     (+ WAIT_SECONDS = timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_SECOND_SENTENCE = 5000 + WAIT_SECONDS;

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
                    return driver.wait(until.elementTextIs(
                        element, FIRST_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_FIRST_SENTENCE);
                }).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, SECOND_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SECOND_SENTENCE)
                ).then(() => {
                    let endTime = new Date();
                    // The first sentence will be displayed more slowly
                    // than the time to wait or sleep.
                    assert.isAbove(
                        endTime - startTime,
                        WAIT_SECONDS + SLEEP_TIME
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

    describe('Change font style', function () {

        /**
         * The path to the tested view.
         */
        const PATH = 'change_font_style.html';

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
         * The timeout for displaying the sentences.
         * The last letter of the fourth sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  60 + 500 [ms] = 3500 [ms] < 5000 [ms] (= timeout),
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

    describe('Make a branch', function () {

        /**
         * The path to the tested view.
         */
        const PATH = 'make_a_branch.html';

        /**
         * The first or second sentence in the sequence.
         */
        const FIRST_OR_SECOND_SENTENCE =
            "I am a cat. I don't have my name yet."
            + "\nDo you want to name me?";

        /**
         * The third sentence in the sequence.
         */
        const THIRD_SENTENCE = "What do you want to name me?";

        /**
         * The fourth sentence in the sequence.
         */
        const FOURTH_SENTENCE = "I am Mike.";

        /**
         * The fifth sentence in the sequence.
         */
        const FIFTH_SENTENCE = "Really? What do you want to name me?";

        /**
         * The sixth sentence in the sequence.
         */
        const SIXTH_SENTENCE = "I am not Mike.";

        /**
         * The timeout for displaying the sentences.
         * The last letter of the first sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  60 + 500 [ms] = 3500 [ms] < 5000 [ms] (= timeout),
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
                        until.elementTextIs(element, FIRST_OR_SECOND_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'button2' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, FIRST_OR_SECOND_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'button1' })
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
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'button1' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, FOURTH_SENTENCE),
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
                        until.elementTextIs(element, FIFTH_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'button2' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, SIXTH_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.findElement({ id: 'button2' })
                ).then(element => {
                    assert(element.isDisplayed)
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

    describe('Display flag status', function () {

        /**
         * The path to the tested view.
         */
        const PATH = 'display_flag_status.html';

        /**
         * The first or second sentence in the sequence.
         */
        const FIRST_SENTENCE = "I am a cat. I don't have my name yet.";

        /**
         * The second sentence in the sequence.
         */
        const SECOND_SENTENCE = "I don't know where I was born.";

        /**
         * The a status message for flag1.
         */
        const FLAG1_STATUS_MESSAGE = "flag1 is set";

        /**
         * The a status message for flag2.
         */
        const FLAG2_STATUS_MESSAGE = "flag2 is set";

        /**
         * The a status message for flag3.
         */
        const FLAG3_STATUS_MESSAGE = "flag3 is set";

        /**
         * The a status message for variable.
         */
        const VARIABLE_STATUS_MESSAGE = "variable is";

        /**
         * The a status message before addition.
         */
        const STATUS_MESSAGE_BEFORE_ADDITION = "1";

        /**
         * The a status message after addition.
         */
        const STATUS_MESSAGE_AFTER_ADDITION = "0";

        /**
         * The a status message before multiplication.
         */
        const STATUS_MESSAGE_BEFORE_MULTIPLICATION = "1";

        /**
         * The a status message after multiplication.
         */
        const STATUS_MESSAGE_AFTER_MULTIPLICATION = "2";

        /**
         * The timeout for displaying the sentences.
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
                    driver.wait(until.elementTextIs(element, FIRST_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
                ).then(() =>
                    driver.findElement({ id: 'flag1' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, FLAG1_STATUS_MESSAGE
                    ))
                ).then(() =>
                    driver.findElement({ id: 'anotherStatusWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, FLAG3_STATUS_MESSAGE
                    ))
                ).then(() =>
                    driver.findElements({ id: 'flag2' })
                ).then(elements => {
                    assert.lengthOf(elements, 0);
                    return driver.findElement
                }).then(() =>
                    driver.findElement({ id: 'variable' })
                ).then(element =>
                    driver.wait(until.elementTextContains(
                        element, VARIABLE_STATUS_MESSAGE
                    ))
                ).then(() =>
                    driver.findElement({ id: 'add' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, STATUS_MESSAGE_BEFORE_ADDITION
                    ))
                ).then(() =>
                    driver.findElement({ id: 'multiply' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, STATUS_MESSAGE_BEFORE_MULTIPLICATION
                    ))
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, SECOND_SENTENCE
                    ), TIMEOUT_FOR_DISPLAYING_SENTENCE)
                ).then(() =>
                    driver.findElement({ id: 'flag2' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, FLAG2_STATUS_MESSAGE
                    ))
                ).then(() =>
                    driver.findElement({ id: 'add' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, STATUS_MESSAGE_AFTER_ADDITION
                    ))
                ).then(() =>
                    driver.findElement({ id: 'multiply' })
                ).then(element =>
                    driver.wait(until.elementTextIs(
                        element, STATUS_MESSAGE_AFTER_MULTIPLICATION
                    ))
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

    describe('Change background color', function () {

        /**
         * The path to the tested view.
         */
        const PATH = 'change_background_color.html';

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
         * The fourth sentence in the sequence.
         */
        const FIFTH_SENTENCE =
            "In addition, it turned out that it was a student,"
            + " which is the most ferocious species of human beings.";

        /**
         * The timeout for displaying the background image.
         */
        const LONG_TIMEOUT_FOR_DISPLAYING_IMAGE = 5000;

        /**
         * The timeout for displaying the fifth sentence.
         * The last letter of the sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  102 + 500 [ms] = 5600 [ms] < 8000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_SENTENCE = 8000;

        /**
         * The timeout for displaying the third and fourth sentence.
         * The last letter of the fourth sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  60 + 500 [ms] = 3500 [ms] < 5000 [ms]
         *     (+ LONG_TIMEOUT_FOR_DISPLAYING_IMAGE = timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_IMAGE_AND_SENTENCE
            = 5000 + LONG_TIMEOUT_FOR_DISPLAYING_IMAGE;

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
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, FIFTH_SENTENCE),
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

    describe('Display an overlay', function () {

        /**
         * The path to the tested view.
         */
        const PATH = 'display_an_overlay.html';

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
         * The timeout for displaying the overlay.
         */
        const LONG_TIMEOUT_FOR_DISPLAYING_OVERLAY = 5000;

        /**
         * The timeout for displaying the first sentence.
         * The last letter of the sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  36 + 500 [ms] = 2300 [ms] < 5000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_SENTENCE = 5000;

        /**
         * The timeout for displaying the third sentence.
         * The last letter of the third sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  56 + 500 [ms] = 3300 [ms] < 5000 [ms]
         *     (+ LONG_TIMEOUT_FOR_DISPLAYING_OVERLAY = timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_OVERLAY_AND_SENTENCE
            = 5000 + LONG_TIMEOUT_FOR_DISPLAYING_OVERLAY;

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
                        TIMEOUT_FOR_DISPLAYING_OVERLAY_AND_SENTENCE
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

    describe('Change message window color', function () {

        /**
         * The path to the tested view.
         */
        const PATH = 'change_message_window_color.html';

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
         * The timeout for changing message window color.
         */
        const TIMEOUT_FOR_CHANGING_COLOR = 500;

        /**
         * The timeout for displaying the first or the third sentence.
         * The last letter of the third sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] *  56 + 500 [ms] = 3300 [ms] < 5000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_SENTENCE = 5000;

        /**
         * The timeout for displaying the second sentence.
         * The last letter of the second sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] * 30 + 500 [ms] = 2000 [ms] < 5000 [ms]
         *     (+ TIMEOUT_FOR_CHANGING_COLOR = timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_CHANGING_COLOR_AND_DISPLAYING_SENTENCE
            = 5000 + TIMEOUT_FOR_CHANGING_COLOR;

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
                        TIMEOUT_FOR_CHANGING_COLOR_AND_DISPLAYING_SENTENCE
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

    describe('Move a message window', function () {

        /**
         * The path to the tested view.
         */
        const PATH = 'move_a_message_window.html';

        /**
         * The first sentence in the sequence.
         */
        const FIRST_SENTENCE = "I am a cat. I don't have my name yet.";

        /**
         * The second sentence in the sequence.
         */
        const SECOND_SENTENCE = "I don't know where I was born.";

        /**
         * The timeout for moving message window.
         */
        const TIMEOUT_FOR_MOVING_WINDOW = 500;

        /**
         * The timeout for displaying the first sentence.
         * The last letter of the first sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] * 37 + 500 [ms] = 2350 [ms] < 5000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_SENTENCE = 5000;

        /**
         * The timeout for displaying the second sentence.
         * The last letter of the second sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] * 30 + 500 [ms] = 2000 [ms] < 5000 [ms]
         *     (+ TIMEOUT_FOR_CHANGING_COLOR = timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_MOVING_WINDOW_AND_DISPLAYING_SENTENCE
            = 5000 + TIMEOUT_FOR_MOVING_WINDOW;

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
                        TIMEOUT_FOR_MOVING_WINDOW_AND_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_NEXT_BUTTON)
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

    describe('Disable a button', function () {

        /**
         * The path to the tested view.
         */
        const PATH = 'disable_a_button.html';

        /**
         * The first sentence in the sequence.
         */
        const FIRST_SENTENCE = "Do you want to disable the next button?";

        /**
         * The second sentence in the sequence.
         */
        const SECOND_SENTENCE = "Can you utilize the next button?";

        /**
         * The third sentence in the sequence.
         */
        const THIRD_SENTENCE = "Do you want to disable the save button?";

        /**
         * The fourth sentence in the sequence.
         */
        const FOURTH_SENTENCE = "Do you want to disable the load button?";

        /**
         * The fifth sentence in the sequence.
         */
        const FIFTH_SENTENCE = "Can you utilize the buttons?";

        /**
         * The timeout for displaying the sentences.
         * The last letter of the first sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] * 39 + 500 [ms] = 2450 [ms] < 5000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_SENTENCE = 5000;

        /**
         * The sleep time for clicking the next button, the save button or
         * the load button after waiting for displaying a sentence.
         */
        const SLEEP_TIME_FOR_CLICKING_BUTTONS = 1000;

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
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_BUTTONS)
                ).then(() =>
                    driver.findElement({ id: 'button1' })
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
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_BUTTONS)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
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
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_BUTTONS)
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
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_BUTTONS)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element => {
                    assert.isNotTrue(element.isEnabled())
                    return driver.get(BASE_URL + PATH)
                }).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, FIRST_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_BUTTONS)
                ).then(() =>
                    driver.findElement({ id: 'button2' })
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
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_BUTTONS)
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
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_BUTTONS)
                ).then(() =>
                    driver.findElement({ id: 'saveButton' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'button1' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, FOURTH_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.findElement({ id: 'saveButton' })
                ).then(element => {
                    assert.isNotTrue(element.isEnabled());
                    return driver.findElement({ id: 'loadButton' })
                }).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, THIRD_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_BUTTONS)
                ).then(() =>
                    driver.findElement({ id: 'button2' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, FOURTH_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_BUTTONS)
                ).then(() =>
                    driver.findElement({ id: 'button1' })
                ).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, FIFTH_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.findElement({ id: 'loadButton' })
                ).then(element => {
                    assert.isNotTrue(element.isEnabled());
                    return driver.findElement({ id: 'messageWindow' });
                }).then(element =>
                    driver.wait(
                        until.elementTextIs(element, FIFTH_SENTENCE),
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

    describe('Hide a button', function () {

        /**
         * The path to the tested view.
         */
        const PATH = 'hide_a_button.html';

        /**
         * The first sentence in the sequence.
         */
        const FIRST_SENTENCE = "I hide the next button...";

        /**
         * The second sentence in the sequence.
         */
        const SECOND_SENTENCE = "Do you want to hide the save button?";

        /**
         * The third sentence in the sequence.
         */
        const THIRD_SENTENCE = "Do you want to hide the load button?";

        /**
         * The fourth sentence in the sequence.
         */
        const FOURTH_SENTENCE = "Can you utilize the buttons?";

        /**
         * The timeout for displaying the sentences.
         * The last letter of the first sentence will be displayed in
         *   delay [ms] * #letters + duration [ms]
         *   = 50 [ms] * 36 + 500 [ms] = 2300 [ms] < 5000 [ms] (= timeout),
         * so the test should be done before its timeout.
         */
        const TIMEOUT_FOR_DISPLAYING_SENTENCE = 5000;

        /**
         * The sleep time for clicking the next button, the save button or
         * the load button after waiting for displaying a sentence.
         */
        const SLEEP_TIME_FOR_CLICKING_BUTTONS = 1000;

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
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_BUTTONS)
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
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_BUTTONS)
                ).then(() =>
                    driver.findElement({ id: 'nextButton' })
                ).then(element => {
                    assert.isNotTrue(element.isDisplayed());
                    return driver.findElement({ id: 'button1' })
                }).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, THIRD_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_BUTTONS)
                ).then(() =>
                    driver.findElement({ id: 'saveButton' })
                ).then(element => {
                    assert.isNotTrue(element.isDisplayed());
                    return driver.findElement({ id: 'button1' })
                }).then(element =>
                    element.click()
                ).then(() =>
                    driver.findElement({ id: 'messageWindow' })
                ).then(element =>
                    driver.wait(
                        until.elementTextIs(element, FOURTH_SENTENCE),
                        TIMEOUT_FOR_DISPLAYING_SENTENCE
                    )
                ).then(() =>
                    driver.sleep(SLEEP_TIME_FOR_CLICKING_BUTTONS)
                ).then(() =>
                    driver.findElement({ id: 'loadButton' })
                ).then(element => {
                    assert.isNotTrue(element.isDisplayed());
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
