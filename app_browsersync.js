let express = require('express'),
    path = require('path'),
    /*
     https://github.com/tj/consolidate.js
     template engine consolidation library for node.js
     */
    consolidate = require('consolidate');

let isDev = process.env.NODE_ENV !== 'production';
let app = express();
const localhost = require('./webpack.public.config')
let port = 8081;

app.engine('html', consolidate.ejs); // config template engine
app.set('view engine', 'html'); // set key value
app.set('views', path.resolve(__dirname, './server/views'));// set key value

/*
 locals
 To provide global data when template rendering
 */
app.locals.env = process.env.NODE_ENV || 'dev';
app.locals.reload = false;

// 如果是开发环境
if (isDev) {
    let webpack = require('webpack'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware'),
        webpackDevConfig = require('./webpack.dev.config');

    let compiler = webpack(webpackDevConfig);

    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: true,
        stats: {
            colors: true
        }
    }));
    app.use(webpackHotMiddleware(compiler));
    /*
     config route
     */
    require('./server/routes/index.js')(app);

    // browsersync is a nice choice when modifying only views (with their css & js)
    let bs = require('browser-sync').create();
    app.listen(port, function () {
        bs.init({
            open: false,
            ui: false,
            notify: false,
            proxy: `${localhost.localhost}${port}`,
            files: ['./server/views/**'],
            port: 8082
        });
        console.log('App (dev) is going to be running on port 8082 (by browsersync).');
    });

} else {
    app.use(express.static(path.join(__dirname, './dist')));
    require('./server/routes')(app);
    app.listen(port, function () {
        console.log('App (production) is now running on port 8081!');
    });
}
