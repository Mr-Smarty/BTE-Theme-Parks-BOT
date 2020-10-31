const http = require('http');
const https = require('https');
const { resolve } = require('path');

const getData = async (url) => {
    const lib = url.startsWith('https://') ? https : http;
  
    return new Promise((resolve, reject) => {
        const req = lib.get(url, res => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error(`Status Code: ${res.statusCode}`));
            }

            const data = [];

            res.on('data', chunk => data.push(chunk));
            res.on('end', () => resolve(Buffer.concat(data).toString()));
        });
  
        req.on('error', reject);
        req.end();
    });
};

const pages = async () => {
    try {
        let html = await getData('https://buildtheearth.net/buildteams/121/members',);
        let pages = await (html = (html = html.substring(html.indexOf('<div class="pagination">'))).substring(0, html.indexOf("</div>"))).match(/<a(.+)>(.+)<\/a>/g)
        let pageCount = await parseInt(pages[pages.length - 1].match(/(\d+)(?!.*\d)/g))
        return pageCount
    } catch (error) {
        console.error(error);
    }
}

const getPages = async pageCount => {
    let returns = []
    try {
        for (page = 1; page <= pageCount; page++) {
            try {
                let pageData = await getData('https://buildtheearth.net/buildteams/121/members?page=' + page)
                returns.push(pageData)
            } catch (error) {
                return error
            }
        }
    } catch (error) {
        return error
    } finally {return returns}
}

const iteratePages = async pages => {
    if (!Array.isArray(pages)) return
    try {
        let returns = []
        await pages.forEach(page => {
            let list = page.match(/<td>(.+)<\/td>/g);
            if (list)
                for (var element = 1; element < list.length; element += 3)
                    returns.push(list[element].replace(/<td>/g, "").replace(/<\/td>/g, ""));
        })
        return returns
    } catch (error) {
        return error
    }   
}

exports.run = () => {
    return new Promise((resolve, reject) => {
        pages().then(pageCount => getPages(pageCount)).then(pages => iteratePages(pages)).then(data => resolve(data)).catch(err => reject(err))
    })
}