///====================
// 基本配置
///====================
// 设置 NODE_ENV
//development 环境 debug：true 
fis.once('compile:start', function(file) {
    if (fis.project.currentMedia() != "dev") {
        process.env.NODE_ENV = 'production';
    } else {
        process.env.NODE_ENV = 'development';
    }
});

// 忽略fis中部分文件等
fis.set('project.ignore', [
    'output/**',
    'node_modules/**',
    '.git/**',
    '.svn/**',
    'dev/**',
    'dist/**',
    'fis-**',
    'package.json',
    'LICENSE',
    '*.md',
    '*.lock'
]);

//壓縮less文件
fis.match('assets/less/main.less', {
    parser: fis.plugin('less'),
    rExt: '.css',
    isCssLike: true,
    packTo: 'assets/css/main.css'
});

// packOrder
// 解释：用来控制合并时的顺序，值越小越在前面。配合 packTo 一起使用。
// 值类型：Integer
// 默认值：0
//export, module, require不压缩变量名
fis.config.set('settings.optimizer.uglify-js', {
    mangle: {
        except: 'exports, module, require, define'
    }
});

//自动去除console.log等调试信息
fis.config.set('settings.optimizer.uglify-js', {
    compress: {
        drop_console: true
    }
});

fis.match('lib/{*,**/*}.js', {
    isMod: false,
    optimizer: fis.plugin('uglify-js'),
    packTo: 'js/dist/vendor.min.js'
});

fis.match('::package', {
    packager: fis.plugin('map', {
        'js/dist/vendor.min.js': [
            'lib/jquery.tools.min.js',
            'lib/jquery.custom-scrollbar2.js',
            'lib/base64.js',
            'lib/underscore.js',
            'lib/backbone.js',
            'lib/swfobject.js'
        ]
    })
})

//壓縮所有的png圖片等
fis.match('*.png', {
    optimizer: fis.plugin('png-compressor')
});


// 支持npm模块
fis.unhook('components');
fis.hook('node_modules', {
    mergeLevel: 3
});

//可选参数, 高级配置
fis.match('js/index.js', {
    isMod: true,
    parser: fis.plugin('browserify'),
    release: 'js/dist/bundle$1'
});

fis.match('*.{js,css,png,jpg,gif}', {
    url: './$0',
    //  release: '$0',
    // domain: '.'
});

fis.match('*.{png,jpg,gif}', {
    release: '$0',
    url: '../..$0',
    // domain: '.',
});

// 針對開發環節下fis配置
fis.media('dev').match('*', {
    useHash: false,
    useSprite: false,
    optimizer: null
});


// 針對開發環節下fis配置
fis.media('prod').match('js/index.js', {
    parser: fis.plugin('browserify'),
    release: 'js/dist/bundle.min$1'
}).match('*', {
    useHash: false,
    useSprite: true,
    optimizer: fis.plugin('uglify-js')
})

// fis.media('prod').match('*.js', {
//       domain: 'http://cdn.baidu.com/'
//   });