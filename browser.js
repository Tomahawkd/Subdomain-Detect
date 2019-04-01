const puppeteer = require('puppeteer');
const util = require('./util');


module.exports = {

    crawlPages: (entryUrl) => {
        puppeteer.launch().then(async browser => {
            const page = await browser.newPage();
            await page.goto(entryUrl);
            
            const links = await page.evaluate(
                () => Array.from(document.body.querySelectorAll('a[href]'), ({ href }) => href)
            );
            const srcs = await page.evaluate(
                () => Array.from(document.body.querySelectorAll('[src]'), ({ src }) => src)
            );
            await links.concat(srcs);
            var filterd = await filterLinks(entryUrl, links);
            await browser.close();
            await util.appendData(getHost(entryUrl), filterd);
        });
    }, 
};

function analyzeBaseHost(url) {
    url = url.toString();
    var host = getHost(url);
    if (host) {
        const list = host.split(".");
        const length = list.length;
        if (length <= 1) return undefined;
        return list[length-2] + "." + list[length-1];
    }
    return undefined;
}

function getHost(url) {
    url = url.toString();
    try {
        var host = url.split("://", 2)[1].split("/", 1)[0];
        return host;
    } catch(err) {
        return undefined;
    }
}

function filterLinks(entryUrl, links) {
    var filterd = links.filter((value) => getHost(entryUrl) != getHost(value) && 
                                    analyzeBaseHost(entryUrl) == analyzeBaseHost(value));
    filterd = Array.from(new Set(filterd.map(getHost)).values()).join("\n");
    return filterd;
}