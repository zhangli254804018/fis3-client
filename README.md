#fis3-client

#使用規則更新
[構建工具](https://zhangli254804018.github.io/fis3-generator-client/)
```
        構建項目初始化
        npm i fis3-generator-client -g
        生成項目
        fisc myapp
        下載依賴包
        npm i
        進行開發
        npm run dev
        開發訪問地址：your host
        正式環境為
        npm run build
        正式訪問地址：your host
```

- 1、项目采用fis3开发结构项目
- 2、支持common.js写法等 不依赖requirejs等
- 3、支持es6语法等 
- 4、可以实行单页面和多页面的开发 要修改入口配置 
- 5、原则上fis不针对文件做修改 编辑等 

   但是为了启动单页面 更好的开发 我们需要在项目上做以下修改来适应开发。
    a.新增解析hook-commonjs & hook-amd 等插件兼容写法模块
    b.新增解析parser-less 插件解析less文本文件

```
        "fis-parser-less": "^0.1.3",
        "fis-parser-utc": "^0.0.2",
        "fis3-hook-amd": "^0.2.0",
        "fis3-hook-commonjs": "^0.1.26",
        "fis3-hook-node_modules": "^2.2.8",
        "fis3-parser-client": "^1.2.2",
        "fis3-postpackager-autoloader": "^1.0.2",
        "fis3-postpackager-loader": "^2.1.4",
        "fis3-postpackager-simple": "^0.0.27"
```
- 6、使用項目結構為
```
        依賴包：fis3-client
        參考文件結構為:
                -assets
                        -img
                        -less
                        -css
                        -pic
                        -swf
                        ……
                js
                        -api
                        -dist
                        -dev
                        index.js
                        ……
                lib
                        -jquery
                        ……
                fis-conf.js
                package.json
                        "fis3-client":"*"
```

- 7、后期需要更多的优化兼容开发体验等
- 8、更新fis3-parser-client fis3-generator-client新增兼容ie編譯js腳本

* [架构源码参考](https://github.com/zhangli254804018/fis3-client)
* [構造項目結構-fis3-generator-client](https://www.npmjs.com/package/fis3-generator-client)
* [核心依賴插件-fis3-parser-client](https://www.npmjs.com/package/fis3-parser-client)





















