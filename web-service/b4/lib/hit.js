const pathModule = require('path');
const puppeteer = require('puppeteer');

module.exports = (app) => {
    app.get("/hit/html2images", (req, res) => {
        const uuid = () => {
            return (new Date().getTime().toString(16)+Math.random().toString(16).substr(2)).substr(2,16);
        };

        const html2images = async (url, option = {}, res) => {
            const { query, width = 750, height = 1334, mode } = option;
            try {
                const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
                const page = await browser.newPage();
                const fid = uuid();
                const path = `${fid}.png`;
                // viewport directly affects the quality of the output image.
                await page.goto(url, {
                    waitUntil: 'networkidle2'
                });
                const iheight = mode === "scroll" ? await page.evaluate(`$('${query}')[0].scrollHeight`) : height;
                await page.setViewport({
                    width: parseInt(width),
                    height: parseInt(iheight)
                });

                await autoScroll(page);

                if (query) {
                    const target = await page.$(query);
                    if (target) {
                        await target.screenshot({ path });
                    } else {
                        throw('target not founded...');
                    }
                } else {
                    await page.screenshot({ path });
                }

                return { path };

                await browser.close();
            } catch(e) {
                throw(e);
            }
        };

        const downloadImage = (path, name, res) => {
            return new Promise((resolve, reject) => {
                res.download(path, name, function(err) {
                    if(err) {
                        reject(err);
                    }else {
                        resolve();
                    }
                });
            });
        };

        const actionHtml2images = async (req, res) => {
            try {
                const { url, query, bizType, width = 750, height = 1334, download, mode } = req.query;
                const result = await html2images(url, {
                    query,
                    bizType,
                    width,
                    height,
                    mode
                }, res);
                if(download) {
                    const localPath = pathModule.join(__dirname, "../", result.path);
                    const imgName = localPath.slice(localPath.lastIndexOf("/") + 1);
                    await downloadImage(localPath, imgName, res);
                }
            } catch (e) {
                res.json({
                    success: false,
                    errorMsg: e
                });
            }
        }

        async function autoScroll(page){
            await page.evaluate(async () => {
                await new Promise((resolve, reject) => {
                    var totalHeight = 0;
                    var distance = 100;
                    var timer = setInterval(() => {
                        var scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;

                        if(totalHeight >= scrollHeight){
                            clearInterval(timer);
                            resolve();
                        }
                    }, 100);
                });
            });
        }

        actionHtml2images(req, res);
    })
}