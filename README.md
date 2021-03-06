# flyer-ui
flyerUI是一款采用自身模块规范编写的国产前端UI框架，遵循原生HTML/CSS/JS的书写与组织形式， 门槛极低，拿来即用。其外在极简，却又不失饱满的内在，体积轻盈，组件丰盈，从核心代码到API 的每一处细节都经过精心雕琢，非常适合界面的快速开发。flyerUI还很年轻，目前的版本是内部beta版，欢迎大家提意见和吐槽，她区别于那些基于MVVM底层的UI框架，却并非逆道而行，而是信奉返璞归真之道，准确地说， 她更多是为服务端程序员量身定做，你无需涉足各种前端工具的复杂配置，只需面对浏览器本身， 让一切你所需要的元素与交互、从这里信手拈来。后期也会结合现在的MVVM框架，如(vue.js,react.js等）

<pre class="codes"><h1>flyer-ui 目录说明</h1><ol><li>    |-- CSS //css目录</li><li>    |  |-- flyer.all.min.css //所有的样式全在这里，目前32KB左右。</li><li>    |-- JS //JS目录</li><li>    |  |-- flyer.all.js //开源版，提供给使用者参考调试，目前115KB。</li><li>    |  |-- flyer.all.min.js //生产版，提供给运行环境，目前45KB。</li><li>    |-- Plugins //插件目录</li><li>    |  |-- CSS 目录</li><li>    |     |-- animate.min.css 动画样式库（来源于https://daneden.github.io/animate.css/)</li><li>    |     |-- font-awesome.min.css 字体图标样式库 （来源于http://fontawesome.io/icons/)</li><li>    |  |-- fonts 目录 (来源于http://fontawesome.io/icons/)</li><li>    |     |-- fontawesome-webfont.eot</li><li>    |     |-- fontawesome-webfont.svg</li><li>    |     |-- fontawesome-webfont.ttf</li><li>    |     |-- fontawesome-webfont.woff</li><li>    |     |-- fontawesome-webfont.woff2</li><li>    |     |-- FontAwesome.otf</li><li>    |  |-- JS 目录</li><li>    |     |-- jquery.min.js</li><li>    </li></ol></pre>
<div>
上述的文档结构中，主要是Pluging目录里的文件比较多，其目地是为了字体图标和动画效果，如果项目不需要，可以直接去掉，只留下jquery.min.js类库就可以了。
</div>
