// 在这里书写 testgulp 项目的打包配置

//1. 导入 gulp 这个第三方模块
//  当你导入模块的时候，会优先去内置模块中查找，如果没有，就去 node_modules 里面查找
//  导入进来以后，就可以使用 gulp.xxx() 的各种方法了
const gulp=require('gulp')

// 导入 gulp-cssmin 这个第三方模块
// 这个模块导入以后，cssmin 变量得到的就是一个函数
// 直接执行就能把 css 文件压缩了
const cssmin=require('gulp-cssmin')

// 导入 gulp-autoprefixer 这个第三方模块
// 这个模块导入以后，autoprefixer 变量得到的就是一个函数
// 直接执行 传递一个参数（参数是对象），就能把css文件自动添加前缀
const autoprefixer=require('gulp-autoprefixer')

const uglify=require('gulp-uglify')

const babel=require('gulp-babel')

// 导入进来以后，会得到一个函数，执行函数即可，但不会压缩，想要压缩，需要传参
const htmlmin=require('gulp-htmlmin')

// 跟 gulp 无关联，直接执行就可以删除
const del=require('del')

// 8 导入 gulp-webserver 这个第三方模块，导入以后可以得到一个函数
const webserver=require('gulp-webserver')

// 2. 打包 css 的方法
const cssHandler=()=>{
    return gulp.src('./src/css/*.css')
    .pipe(autoprefixer())
    .pipe(cssmin())  //压缩 css 代码
    .pipe(gulp.dest('./dist/css'))  //压缩完以后的代码 放入 dist文件夹下的css文件夹下
}

// 3. 打包 js 的方法
const jsHandler=()=>{
    return gulp.src('./src/js/*.js')
                .pipe(babel({
                    presets:['@babel/env']  //需要传参
                }))
                .pipe(uglify())
                .pipe(gulp.dest('./dist/js'))
}

// 4. 打包 html 的方法
const htmlHandler=()=>{
    return gulp.src('./src/pages/*.html')
                .pipe(htmlmin({
                    removeAttributeQuotes:true, //移除属性上的双引号
                    removeComments:true,   //移除注释
                    collapseWhitespace:true,    //移除所有空格，变成一行代码
                    minifyCSS:true,     //把页面里面的 style 标签里面的css代码也去空格
                    minifyJS:true,     //把页面里面的 script 标签里面的js代码也去空格
                }))
                .pipe(gulp.dest('./dist/pages'))
}

// 5 书写一个移动 image 文件的方法
//  图片尽量不压缩，会失真
const imgHandler=()=>{
    return gulp.src('./src/img/**')   //img 文件夹下的所有文件
                .pipe(gulp.dest('./dist/img'))
}

const libHandler=()=>{
    return gulp.src('./src/lib/**')
                .pipe(gulp.dest('./dist/lib'))
}

// 6. 写一个移动 lib 文件的方法
//  lib 里面存放的都是项目中用到的第三方，eg: jQuery/swiper 包括我们自己写的
// 因为大部分都是第三方的，人家压缩好的，所以直接转移就可以了

// 7.书写一个任务，自动删除 dist 目录
const delHandler=()=>{
    return del(['./dist'])  //参数传递一个数组，删除数组里面的
}

// 8.书写一个配置服务器的任务
//     在开发过程中直接把写的东西在服务器上打开，可以一边写一边修改，一边测试，
//     因为 gulp 是基于 node 运行的，这里就是使用 node 给我们开启一个服务器，不是 apach,也不是 nginx
//    自动刷新：当 dist 目录里面的代码改变以后，就会自动刷新浏览器
const severHandler=()=>{
    // 要把页面在服务器上打开，打开的是 dist 目录里面我已经压缩好的页面
    return gulp.src('./dist')  //找到我要打开的页面的文件夹，把这个文件夹当作网站根目录
                .pipe(webserver({ //需要一些配置项
                    host:'localhost', //域名，这个域名可以自定义
                    port:8080,  //端口号，0~65535，尽量不适应 0~1023
                    open:'./pages/index.html', //你默认打开的首页，从 dist 下面的目录开始书写
                    livereload:true, //自动刷新浏览器（热重启）
                    //所有的代理配置都在 proxies里面，
                    proxies:[{
                        // source: '/gx',  //源，你的代理标识符
                        // target: 'http://127.0.0.1:666'  //目标，你要代理的地址  这里只写代理的域名即可，不用写详细的那个文件名，详细的文件名写道发起请求的里面
                        source: '/gv',
                        target: 'http://jx.xuzhixiang.top/ap/api/productlist.php'
                    },
                    {
                        source: '/login',
                        target:'http://localhost:666/workWeek/php/login.php'
                    },
                    {
                        source: '/sign',
                        target:'http://localhost:666/workWeek/php/sign.php'
                    },
                    {
                        source: '/order',
                        target:'https://api.search.mi.com/search'
                    },
                ] 
                }))
}
/**
 * webserver 这个第三方模块可以顺带配置代理
 */
/**
 * webserver 使用自定义域名
 *  + 如果你想使用一个 你自己定义的域名，就要修改你下你电脑里的 hosts 文件
 *      =>  位置： -> windows -> system32 -> drivers -> etc -> hosts
 *      =》 把hosts文件拖入 vscode 在最后一行加入： 127.0.0.1  你自己定义的域名
 */

// 9. 自动监控文件
//      监控src 下面的文件，只要一修改就执行对应任务
const watchHandler=()=>{
    gulp.watch('./src/css/*.css',cssHandler)
    gulp.watch('./src/js/*.js',jsHandler)
    gulp.watch('./src/pages/*.html',htmlHandler)
}


// 最后在文件里面导出我准备好的这个方法
// 导出以后就可以在命令行执行 gulp css 的指令了
module.exports.css=cssHandler

// 导出以后就可以在命令行执行 gulp js 的指令了
module.exports.js=jsHandler

module.exports.html=htmlHandler

module.exports.img=imgHandler
module.exports.lib=libHandler

// 导出一个默认任务
// 当在命令行执行 gulp default 的时候，就会自动把 parallel里的任务一起执行
//   注：在命令行执行 gulp 这个指令，等于执行 gulp default
// module.exports.default=gulp.parallel(cssHandler,htmlHandler,imgHandler)

// 先执行删除，再执行各个任务
module.exports.default=gulp.series(
    delHandler,
    gulp.parallel(cssHandler,htmlHandler,imgHandler,libHandler),
    severHandler,
    watchHandler
)

