const fs = require('fs')
const xml2js = require('xml2js')
const util = require('util')

const parser = new xml2js.Parser()

fs.readFile('file.xml', (err,data) => {
    parser.parseString(data, (err,result) => {
        //console log of all the items, not breaking out which individual items we want
        // console.log(result['rss']['channel'][0]['item'])
        const items = result['rss']['channel'][0]['item'];
        items.forEach(item => {
            const title = item.title[0];
            const pubDate = item.pubDate[0];
            const link = item.link[0]
            const description = item.description[0];
            console.log(`${title} - ${pubDate} - ${description}\n`);
            console.log(link)
        });
    })
})

