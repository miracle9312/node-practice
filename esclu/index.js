const pkg = require('./package');
const program = require('commander');
const request = require('request');

const fullUrl = (path='') => {
    let url = `http://${program.host}:${program.port}/`;
    return url + path.replace(/^\/*/, '');
};

const handleResponse = (err, res, body) => {
    if(program.json) {
        console.log(JSON.stringify(err || body));
    }else {
        if(err) throw err;
        console.log(body)
    }
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

// 返回请求全路径
program
    .command('url [path]')
    .description('generate url')
    .action((path='/') => console.log(fullUrl(path)));

// get请求
program
    .command('get [path]')
    .description('get request for path')
    .action((path='/') => {
        const options = {
            url: fullUrl(path),
            json: program.json
        };
        request(options, handleResponse)
    });

// 创建索引
program
    .command('create-index')
    .description('create es index')
    .action(() => {
        if(!program.index) {
            const msg = 'no index';
            if(!program.index) throw err
            console.log(JSON.stringify({err: msg}))
        }

        request.put(fullUrl(), handleResponse)
    });

program
    .command('list-indices')
    .alias('li')
    .description('list indices')
    .action(() => {
        const path = program.json ? '_all' : '_cat/indices?v';
        request({url: fullUrl(path), json: program.json}, handleResponse);
    });

// 序列化命令行参数，判断输入返回默认输出
program.parse(process.argv)

if(!program.args.filter(arg => typeof arg === 'object').length) {
    program.help()
}