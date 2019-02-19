const rp = require('request-promise');

// 书单管理
module.exports = (app, es) => {
    const url = `http://${es.host}:${es.port}/${es.bundle_index}/bundle`;
    // 新建书单
    app.post('/api/bundle', (req, res) => {
        const bundle = {
            name: req.query.name,
            books: []
        };

        rp.post({url, body: bundle, json: true})
            .then(esResBody => res.status(201).json(esResBody))
            .catch(({error}) => res.status(error.statusCode || 502).json(error))
    });

    // 查询书单
    app.get('/api/bundle/:id', async (req, res) => {
        const options = {
            url: `${url}/${req.params.id}`,
            json: true
        };

        try{
            const esResBody = await rp(options);
            res.status(200).json(esResBody);
        }catch(e) {
            res.status(e.statusCode || 502).json(e.error)
        }
    });

    // 为书单重新命名
    app.put('/api/bundle/:id/name/:name', async (req, res) => {
        try {
            const bundleUrl = `${url}/${req.params.id}`;

            const bundle = (await rp({url: bundleUrl, json: true}))._source;
            bundle.name = req.params.name;
            const esResbody =  await rp.put({url: bundleUrl, body: bundle, json: true});
            res.status(200).json(esResbody);
        }catch(e) {
            res.status(e.statusCode || 502).json(e.error);
        }
    });

    // 将书放入书单
    app.put('/api/bundle/:id/book/:pgid', async (req, res) => {
        try {
            const bundleUrl = `${url}/${req.params.id}`;
            const bookUrl = `http://${es.host}:${es.port}/${es.books_index}/book/${req.params.pgid}`;
            const [bundleRes, bookRes] = await Promise.all([
                rp({url: bundleUrl, json: true}),
                rp({url: bookUrl, json: true})
            ]);
            const {_source: bundle, _version: version} = bundleRes;
            const {_source: book} = bookRes;

            const idx = bundle.books.findIndex(book => book.id === req.params.pgid);
            if(idx === -1) {
                bundle.books.push({
                    id: book.id,
                    title: book.title
                });

                const esResBody = rp.put({
                    url: bundleUrl,
                    body: bundle,
                    json: true,
                    qs: { version }
                });

                res.status(200).json(esResBody);
            }
        }catch(e){
            res.status(e.statusCode || 502).json(e.error);
        }
    });
};