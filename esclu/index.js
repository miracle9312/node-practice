const pkg = require('./package');
const program = require('commander');

const fullUrl = (path='') => {
    let url = `http://${program.host}:${program.port}/`;
    return url + path.replace(/^\/*/, '');
};

program
    .version(pkg.version, '-v, --version')
    .description(pkg.description)
    .usage('[options] <command> [...]')
    .option('-o, --host <hostname>', "hostname[localhost]", 'localhost')
    .option('-p, --port <number>', "port number [9200]", '9200')
    .option('-j, --json', 'format output as JSON')
    .option('-i, --index <name>', 'which index to use')
    .option('-t, --type <type>', 'default type for bulk operation');

program
    .command('url [path]')
    .description('generate url')
    .action((path='/') => console.log(fullUrl(path)));

program.parse(process.argv)

if(!program.args.filter(arg => typeof arg === 'object').length) {
    program.help()
}