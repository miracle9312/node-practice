const cheerio = require('cheerio');

module.exports = rdf => {
    const $ = cheerio.load(rdf);

    const book = {};
    book.id = +$('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', '');
    book.title = $('dcterms\\:title').text();
    book.authors = $('pgterms\\:agent pgterms\\:name').toArray().map(term => $(term).text());
    book.subjects = $('[rdf\\:resource$="/LCSH"]')
        .parent().find('rdf\\:value')
        .toArray().map(ele => $(ele).text());
    console.log(book);
    return book;
};