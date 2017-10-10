module.exports = function (app) {
    /*
     此处配置所需的路由
     */
    app.use('/', require('./page1'));
    app.use('/1', require('./page1'));
    app.use('/2', require('./page2'));
};
