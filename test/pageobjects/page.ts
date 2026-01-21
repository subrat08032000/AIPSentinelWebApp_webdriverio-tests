import { browser } from "@wdio/globals";

/**
 * main page object containing all methods, selectors and functionality
 * Browser Url lunch- This page is not for any kind of modification.
 */
export default class Page {
  public open(AIPSentinel_URL: string) {
    return browser.url(AIPSentinel_URL);
  }
}
