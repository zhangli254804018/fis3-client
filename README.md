#fis-develop
1、项目采用fis3开发结构项目
2、支持common.js写法等 不依赖requirejs等
3、支持es6语法等 
4、可以实行单页面和多页面的开发 只修要修改入口配置 
5、原则上fis不针对文件做修改 编辑等 
   但是为了启动单页面 更好的开发 我们需要在项目上做以下修改来适应开发。
    a.新增解析hook-commonjs & hook-amd 等插件兼容写法模块
    b.新增解析parser-less 插件解析less文本文件
6、后期需要更多的优化兼容开发体验等 