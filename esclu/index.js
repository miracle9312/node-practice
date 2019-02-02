const pkg = require('./package');
const program = require('commander');
const request = require('request');
const fs = require('fs');

const fullUrl = (path='') => {
    let url = `http://${program.host}:${program.port}/`;
    if(program.index) {
        url += program.index + '/';
        if(program.type) {
            url += program.type + '/'
        }
    }
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
    .option('-t, --type <type>', 'default type for bulk operation')
    .option('-f, --filter <filter>', 'source filter for query result');

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

// 将文件批量导入数据库
program
    .command('bulk <file>')
    .description('批量导入es数据库')
    .action(file => {
        fs.stat(file, (err, stats) => {
            if(err) {
                if(program.json) {
                    console.log(JSON.stringify(err))
                    return
                }
                throw err
            }

            const options = {
                url: fullUrl('_bulk'),
                json: true,
                headers: {
                    'content-length': stats.size,
                    'content-type': 'application/json'
                }
            };

            const req = request.post(options);

            const stream = fs.createReadStream(file);
            stream.pipe(req);
            req.pipe(process.stdout);
        })
    });

// es查询
program
    .command('query [queries...]')
    .alias('q')
    .description('es query')
    .action(queries => {
        const options = {
            url: fullUrl('_search'),
            json: program.json,
            qs: {}
        };

        if(queries && queries.length) {
            options.qs.q = queries.join(' ')
        }

        if(program.filter) {
            options.qs._source = program.filter;
        }

        request(options, handleResponse)
    });

// 序列化命令行参数，判断输入返回默认输出
program.parse(process.argv)

if(!program.args.filter(arg => typeof arg === 'object').length) {
    program.help()
}