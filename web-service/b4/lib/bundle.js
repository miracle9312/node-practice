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
    })

};