const expect = require('chai').expect;
const parseRdf = require('../lib/parse-rdf');
const fs = require('fs');
const path = require('path');

describe("parseRdf", () => {
    const rdf = fs.readFileSync(path.join(__dirname, 'pg100.rdf'));

    it('should be a function', () => {
        expect(parseRdf).to.be.a('function');
    })
    it('should be rdf content', () => {
        const book = parseRdf(rdf);
        expect(book).to.be.an('object');
        expect(book).to.have.a.property('id', 100);
        expect(book).to.have.a.property('title', 'The Complete Works of William Shakespeare');

        expect(book).to.have.a.property('authors')
            .that.is.an('array').with.lengthOf(1)
            .and.contains('Shakespeare, William' )
        expect(book).to.have.a.property('subjects')
            .that.is.an('array').with.lengthOf(1)
            .and.contains('English drama -- Early modern and Elizabethan, 1500-1600')
    })
});