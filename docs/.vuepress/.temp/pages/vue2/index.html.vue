<template><div><h2 id="vue2" tabindex="-1"><a class="header-anchor" href="#vue2"><span>vue2</span></a></h2>
<h3 id="前置知识" tabindex="-1"><a class="header-anchor" href="#前置知识"><span>前置知识</span></a></h3>
<p>目标：掌握Vue2核心源码的执行流程，掌握Vue2 diff的使用</p>
<p>使用什么框架进行开发？</p>
<p>使用什么方式进行类型校验呢？</p>
<p>dev 的核心是scripts/config中标识出来</p>
<p>flow（了解即可， ）的作用类似于ts，因为编写vue2时，flow更加完善，适合es6的编写，使用时在文件上增加@flow注释.</p>
<p>1.类型推断：在开发的时候，编译过程中就能找到类型的问题</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre class="language-javascript"><code><span class="line"><span class="token comment">/* @flow */</span></span>
<span class="line"><span class="token keyword">function</span> <span class="token function">split</span><span class="token punctuation">(</span><span class="token parameter">str</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> str<span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">'.'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token function">split</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2.类型注释：</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre class="language-javascript"><code><span class="line"><span class="token comment">/* @flow */</span></span>
<span class="line"><span class="token keyword">function</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">x</span><span class="token operator">:</span>number<span class="token punctuation">,</span><span class="token literal-property property">y</span><span class="token operator">:</span>number</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> x<span class="token operator">+</span>y</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token function">add</span><span class="token punctuation">(</span><span class="token string">'123'</span><span class="token punctuation">,</span><span class="token number">456</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">// 会报错，因为类型不符合</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>vue2 强调es6 eslint flow</p>
<h3 id="vue2的核心源码模块" tabindex="-1"><a class="header-anchor" href="#vue2的核心源码模块"><span>Vue2的核心源码模块</span></a></h3>
<p>首先看package.json、scripts向外发散，看目录结构（核心点在src中）</p>
<p>src中文件：1.compiler编译的核心内容，2.core核心代码，3.platforms宿主环境：代码在哪跑。4.server服务端渲染的内容。5.sfc单文件组件。6.shared对应的通用的方法</p>
<p>build过程scipts/build.js</p>
<h4 id="两个点" tabindex="-1"><a class="header-anchor" href="#两个点"><span>两个点</span></a></h4>
<p>runtime only：运行时，将.vue 通过vue-loader解析编译成js文件</p>
<p>runtime + compiler没有对代码进行处理</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre class="language-javascript"><code><span class="line"><span class="token comment">// 需要编译器的版本</span></span>
<span class="line"><span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">template</span><span class="token operator">:</span> <span class="token string">'&lt;div>{{hi}}&lt;/div>'</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">reder</span><span class="token punctuation">(</span><span class="token parameter">h</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">'div'</span><span class="token punctuation">,</span><span class="token keyword">this</span><span class="token punctuation">.</span>hi<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token comment">// 模板语言需要编译器转化成方法，这就是编译的过程</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> vue <span class="token keyword">from</span> <span class="token string">'Vue'</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">new</span> <span class="token class-name">vue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">// 这么使用   _init()核心配置项</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>initGlobalApi 初始化全局api的方法</p>
<p>整个流程：new Vue过程中 -&gt; 进入到initMixin -&gt; 开始$mount的过程 -&gt; 进行compole编译 -&gt; 执行reder -&gt; 本质就是vnode -&gt;update(本质patch)  -&gt; 渲染DOM</p>
<h3 id="vue2中的diff算法" tabindex="-1"><a class="header-anchor" href="#vue2中的diff算法"><span>vue2中的diff算法</span></a></h3>
<p><img src="@source/vue2/image-1.png" alt="alt text"></p>
<p>判断哪些节点需要更新，哪些节点不需要更新</p>
<ol>
<li>只比较同层的节点。</li>
<li>同层比较时，如果类型不同，会把该节点和该节点的所有子节点全部销毁。</li>
<li>类型相同时，key</li>
</ol>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre class="language-javascript"><code><span class="line"><span class="token function">mount</span><span class="token punctuation">(</span>vnode<span class="token punctuation">)</span> <span class="token operator">-</span><span class="token operator">></span> vnode <span class="token operator">-</span><span class="token operator">></span> <span class="token constant">DOM</span></span>
<span class="line">patch diff 更新</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>vue2的diff算法 双端比较  （同级比较）</p>
<p>A B C D E F G</p>
<p>B C D E F G A</p>
<p>步骤：</p>
<ol>
<li>判断是不是首次渲染，如果是首次执行createElement，如果不是首次渲染，如果类型不同，会把该节点和该节点的所有子节点全部销毁。</li>
</ol>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre class="language-javascript"><code><span class="line"><span class="token comment">// 核心参数oldVnode，vnode</span></span>
<span class="line"><span class="token keyword">function</span> <span class="token function">patch</span><span class="token punctuation">(</span><span class="token parameter">oldVnode<span class="token punctuation">,</span> vnode<span class="token punctuation">,</span> hydrating<span class="token punctuation">,</span> removeOnly</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// 判断新的vnode是否为空</span></span>
<span class="line">    <span class="token comment">// 老的节点在，新的节点不在</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isUndef</span><span class="token punctuation">(</span>vnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 卸载所有老的vnode</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token function">invokeDestroyHook</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">return</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">let</span> isInitialPatch <span class="token operator">=</span> <span class="token boolean">false</span></span>
<span class="line">    <span class="token keyword">const</span> <span class="token literal-property property">insertedVnodeQueue</span><span class="token operator">:</span> any<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 老的节点不存在，直接创建新节点</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isUndef</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        isInitialPatch <span class="token operator">=</span> <span class="token boolean">true</span></span>
<span class="line">        <span class="token function">createElm</span><span class="token punctuation">(</span>vnode<span class="token punctuation">,</span> insertedVnodeQueue<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">const</span> isRealElement <span class="token operator">=</span> <span class="token function">isDef</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">.</span>nodeType<span class="token punctuation">)</span></span>
<span class="line">        <span class="token comment">// 老节点不是真实的DOM 节点，并且新老节点的type和key相同，进行patchVnode更新工作</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>isRealElement <span class="token operator">&amp;&amp;</span> <span class="token function">sameVnode</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">,</span> vnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment">// 关键</span></span>
<span class="line">            <span class="token function">patchVnode</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">,</span> vnode<span class="token punctuation">,</span> insertedVnodeQueue<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> removeOnly<span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment">// 如果不是同一元素节点</span></span>
<span class="line">            <span class="token comment">// 当老节点是真实Dom节点</span></span>
<span class="line">            <span class="token comment">// if (isRealElement) {</span></span>
<span class="line">            <span class="token comment">//     if (oldVnode.nodeType === 1 &amp;&amp; oldVnode.hasAttribute(SSR_ATTR)) {</span></span>
<span class="line">            <span class="token comment">//     oldVnode.removeAttribute(SSR_ATTR)</span></span>
<span class="line">            <span class="token comment">//     hydrating = true</span></span>
<span class="line">            <span class="token comment">//     }</span></span>
<span class="line">            <span class="token comment">//     if (isTrue(hydrating)) {</span></span>
<span class="line">            <span class="token comment">//     if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {</span></span>
<span class="line">            <span class="token comment">//         invokeInsertHook(vnode, insertedVnodeQueue, true)</span></span>
<span class="line">            <span class="token comment">//         return oldVnode</span></span>
<span class="line">            <span class="token comment">//     } else if (__DEV__) {</span></span>
<span class="line">            <span class="token comment">//         warn(</span></span>
<span class="line">            <span class="token comment">//         'The client-side rendered virtual DOM tree is not matching ' +</span></span>
<span class="line">            <span class="token comment">//             'server-rendered content. This is likely caused by incorrect ' +</span></span>
<span class="line">            <span class="token comment">//             'HTML markup, for example nesting block-level elements inside ' +</span></span>
<span class="line">            <span class="token comment">//             '&lt;p>, or missing &lt;tbody>. Bailing hydration and performing ' +</span></span>
<span class="line">            <span class="token comment">//             'full client-side render.'</span></span>
<span class="line">            <span class="token comment">//         )</span></span>
<span class="line">            <span class="token comment">//     }</span></span>
<span class="line">            <span class="token comment">//     }</span></span>
<span class="line">            <span class="token comment">//     oldVnode = emptyNodeAt(oldVnode)</span></span>
<span class="line">            <span class="token comment">// }</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">const</span> oldElm <span class="token operator">=</span> oldVnode<span class="token punctuation">.</span>elm</span>
<span class="line">        <span class="token keyword">const</span> parentElm <span class="token operator">=</span> nodeOps<span class="token punctuation">.</span><span class="token function">parentNode</span><span class="token punctuation">(</span>oldElm<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">// 创建新的DOM节点</span></span>
<span class="line">        <span class="token function">createElm</span><span class="token punctuation">(</span></span>
<span class="line">            vnode<span class="token punctuation">,</span></span>
<span class="line">            insertedVnodeQueue<span class="token punctuation">,</span></span>
<span class="line">            <span class="token comment">// extremely rare edge case: do not insert if old element is in a</span></span>
<span class="line">            <span class="token comment">// leaving transition. Only happens when combining transition +</span></span>
<span class="line">            <span class="token comment">// keep-alive + HOCs. (#4590)</span></span>
<span class="line">            oldElm<span class="token punctuation">.</span>_leaveCb <span class="token operator">?</span> <span class="token keyword">null</span> <span class="token operator">:</span> parentElm<span class="token punctuation">,</span></span>
<span class="line">            nodeOps<span class="token punctuation">.</span><span class="token function">nextSibling</span><span class="token punctuation">(</span>oldElm<span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">// update parent placeholder node element, recursively</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span>vnode<span class="token punctuation">.</span>parent<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">let</span> ancestor <span class="token operator">=</span> vnode<span class="token punctuation">.</span>parent</span>
<span class="line">            <span class="token keyword">const</span> patchable <span class="token operator">=</span> <span class="token function">isPatchable</span><span class="token punctuation">(</span>vnode<span class="token punctuation">)</span></span>
<span class="line">            <span class="token keyword">while</span> <span class="token punctuation">(</span>ancestor<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> cbs<span class="token punctuation">.</span>destroy<span class="token punctuation">.</span>length<span class="token punctuation">;</span> <span class="token operator">++</span>i<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                cbs<span class="token punctuation">.</span>destroy<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">(</span>ancestor<span class="token punctuation">)</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">            ancestor<span class="token punctuation">.</span>elm <span class="token operator">=</span> vnode<span class="token punctuation">.</span>elm</span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>patchable<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> cbs<span class="token punctuation">.</span>create<span class="token punctuation">.</span>length<span class="token punctuation">;</span> <span class="token operator">++</span>i<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                cbs<span class="token punctuation">.</span>create<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">(</span>emptyNode<span class="token punctuation">,</span> ancestor<span class="token punctuation">)</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">                <span class="token comment">// #6513</span></span>
<span class="line">                <span class="token comment">// invoke insert hooks that may have been merged by create hooks.</span></span>
<span class="line">                <span class="token comment">// e.g. for directives that uses the "inserted" hook.</span></span>
<span class="line">                <span class="token keyword">const</span> insert <span class="token operator">=</span> ancestor<span class="token punctuation">.</span>data<span class="token punctuation">.</span>hook<span class="token punctuation">.</span>insert</span>
<span class="line">                <span class="token keyword">if</span> <span class="token punctuation">(</span>insert<span class="token punctuation">.</span>merged<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token comment">// start at index 1 to avoid re-invoking component mounted hook</span></span>
<span class="line">                <span class="token comment">// clone insert hooks to avoid being mutated during iteration.</span></span>
<span class="line">                <span class="token comment">// e.g. for customed directives under transition group.</span></span>
<span class="line">                <span class="token keyword">const</span> cloned <span class="token operator">=</span> insert<span class="token punctuation">.</span>fns<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span></span>
<span class="line">                <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> cloned<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                    cloned<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token function">registerRef</span><span class="token punctuation">(</span>ancestor<span class="token punctuation">)</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">            ancestor <span class="token operator">=</span> ancestor<span class="token punctuation">.</span>parent</span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">// destroy old node</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span>parentElm<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token function">removeVnodes</span><span class="token punctuation">(</span><span class="token punctuation">[</span>oldVnode<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">.</span>tag<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token function">invokeDestroyHook</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token function">invokeInsertHook</span><span class="token punctuation">(</span>vnode<span class="token punctuation">,</span> insertedVnodeQueue<span class="token punctuation">,</span> isInitialPatch<span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">return</span> vnode<span class="token punctuation">.</span>elm</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="patchvnode" tabindex="-1"><a class="header-anchor" href="#patchvnode"><span>patchVnode</span></a></h4>
<ol>
<li>vnode oldVnode 指向同一个对象 return</li>
<li>oldVnode DOM -&gt; 关联到真实的elm， update class style props events</li>
<li>oldVnode Vnode <span>123</span> <span>456</span> vnode.text 更新内容</li>
<li>oldVnode 有子节点 Vnode 没有子节点 delete</li>
<li>oldVnode 没有子节点 Vnode 有子节点 add -&gt; creatEle -&gt; 挂在到DOM上</li>
<li>oldVnode Vnode都有子节点 updateChildren</li>
</ol>
<h4 id="updatechildren" tabindex="-1"><a class="header-anchor" href="#updatechildren"><span>updateChildren</span></a></h4>
<p><img src="@source/vue2/image-2.png" alt="alt text"></p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre class="language-javascript"><code><span class="line"><span class="token keyword">function</span> <span class="token function">vue2Diff</span><span class="token punctuation">(</span><span class="token parameter">prevChildren <span class="token punctuation">,</span> nextChildren <span class="token punctuation">,</span>parent</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">let</span> oldStartIndex <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span></span>
<span class="line">        oldEndIndex <span class="token operator">=</span> prevChildren<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">        newStartIndex <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span></span>
<span class="line">        newEndIndex <span class="token operator">=</span> nextChildren<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">let</span> oldStartNode <span class="token operator">=</span> prevChildren<span class="token punctuation">[</span>oldStartIndex<span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">        oldEndNode <span class="token operator">=</span> prevChildren<span class="token punctuation">[</span>oldEndIndex<span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">        newStartNode <span class="token operator">=</span> nextChildren<span class="token punctuation">[</span>newStartIndex<span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">        newEndNode <span class="token operator">=</span> nextChildren<span class="token punctuation">[</span>newEndIndex<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">while</span><span class="token punctuation">(</span>oldStartIndex<span class="token operator">&lt;=</span>oldEndIndex<span class="token operator">&amp;&amp;</span>newStartIndex<span class="token operator">&lt;=</span>newEndIndex<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span><span class="token punctuation">(</span>oldStartNode<span class="token punctuation">.</span>key <span class="token operator">===</span> newStartNode<span class="token punctuation">.</span>key<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment">// 用来更新的</span></span>
<span class="line">            <span class="token function">patch</span><span class="token punctuation">(</span>oldStartNode<span class="token punctuation">,</span>newStartNode<span class="token punctuation">,</span>parent<span class="token punctuation">)</span></span>
<span class="line">            oldStartIndex<span class="token operator">++</span></span>
<span class="line">            newStartIndex<span class="token operator">++</span></span>
<span class="line">            oldStartNode <span class="token operator">=</span> prevChildren<span class="token punctuation">[</span>oldStartIndex<span class="token punctuation">]</span></span>
<span class="line">            newStartNode <span class="token operator">=</span> nextChildren<span class="token punctuation">[</span>newStartIndex<span class="token punctuation">]</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token keyword">else</span> <span class="token keyword">if</span><span class="token punctuation">(</span>oldEndNode<span class="token punctuation">.</span>key <span class="token operator">===</span> newEndNode<span class="token punctuation">.</span>key<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">            <span class="token function">patch</span><span class="token punctuation">(</span>oldEndNode<span class="token punctuation">,</span>newEndNode<span class="token punctuation">,</span>parent<span class="token punctuation">)</span></span>
<span class="line">            oldEndIndex<span class="token operator">--</span></span>
<span class="line">            newEndIndex<span class="token operator">--</span></span>
<span class="line">            oldEndNode <span class="token operator">=</span> prevChildren<span class="token punctuation">[</span>oldEndIndex<span class="token punctuation">]</span></span>
<span class="line">            newEndNode <span class="token operator">=</span> nextChildren<span class="token punctuation">[</span>newEndIndex<span class="token punctuation">]</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token keyword">else</span> <span class="token keyword">if</span><span class="token punctuation">(</span>oldStartNode<span class="token punctuation">.</span>key <span class="token operator">===</span> newEndNode<span class="token punctuation">.</span>key<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">            <span class="token function">patch</span><span class="token punctuation">(</span>oldStartNode<span class="token punctuation">,</span>newEndNode<span class="token punctuation">,</span>parent<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">            parent<span class="token punctuation">.</span><span class="token function">insertBefore</span><span class="token punctuation">(</span>oldStartNode<span class="token punctuation">.</span>elm<span class="token punctuation">,</span>oldEndNode<span class="token punctuation">.</span>elm<span class="token punctuation">.</span>nextSibling<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            oldStartIndex<span class="token operator">++</span></span>
<span class="line">            newEndIndex<span class="token operator">--</span></span>
<span class="line">            oldStartNode <span class="token operator">=</span> prevChildren<span class="token punctuation">[</span>oldStartIndex<span class="token punctuation">]</span></span>
<span class="line">            newEndNode <span class="token operator">=</span> nextChildren<span class="token punctuation">[</span>newEndIndex<span class="token punctuation">]</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token keyword">else</span> <span class="token keyword">if</span><span class="token punctuation">(</span>oldEndNode<span class="token punctuation">.</span>key <span class="token operator">===</span> newStartNode<span class="token punctuation">.</span>key<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">            <span class="token function">patch</span><span class="token punctuation">(</span>oldEndNode<span class="token punctuation">,</span>newStartNode<span class="token punctuation">,</span>parent<span class="token punctuation">)</span></span>
<span class="line">            oldEndIndex<span class="token operator">--</span></span>
<span class="line">            newStartIndex<span class="token operator">++</span></span>
<span class="line">            oldEndNode <span class="token operator">=</span> prevChildren<span class="token punctuation">[</span>oldEndIndex<span class="token punctuation">]</span></span>
<span class="line">            newStartNode <span class="token operator">=</span> nextChildren<span class="token punctuation">[</span>newStartIndex<span class="token punctuation">]</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">else</span><span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment">// 四次比较都没比较到</span></span>
<span class="line">            <span class="token comment">// 在prevChildren中找newStartNode的key</span></span>
<span class="line">            <span class="token keyword">let</span> newKey <span class="token operator">=</span> newStartNode<span class="token punctuation">.</span>key</span>
<span class="line">            oldIndex  <span class="token operator">=</span> prevChildren<span class="token punctuation">.</span><span class="token function">findIndex</span><span class="token punctuation">(</span><span class="token parameter">child</span> <span class="token operator">=></span> child<span class="token punctuation">.</span>key <span class="token operator">===</span> newKey<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">            <span class="token keyword">if</span><span class="token punctuation">(</span>oldIndex <span class="token operator">></span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">let</span> oldNode <span class="token operator">=</span> prevChildren<span class="token punctuation">[</span>oldIndex<span class="token punctuation">]</span></span>
<span class="line">                <span class="token function">patch</span><span class="token punctuation">(</span>oldNode<span class="token punctuation">,</span>newStartNode<span class="token punctuation">,</span>parent<span class="token punctuation">)</span></span>
<span class="line">                parent<span class="token punctuation">.</span><span class="token function">insertBefore</span><span class="token punctuation">(</span>oldNode<span class="token punctuation">.</span>elm<span class="token punctuation">,</span>oldStartNode<span class="token punctuation">.</span>elm<span class="token punctuation">)</span></span>
<span class="line">                prevChildren<span class="token punctuation">[</span>oldIndex<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">undefined</span> <span class="token comment">// 当前序号为oldIndex中是空</span></span>
<span class="line">            <span class="token punctuation">}</span><span class="token keyword">else</span><span class="token punctuation">{</span></span>
<span class="line">                <span class="token function">mount</span><span class="token punctuation">(</span>newStartNode<span class="token punctuation">,</span>parent<span class="token punctuation">,</span>oldStartNode<span class="token punctuation">.</span>elm<span class="token punctuation">)</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">            newStartNode <span class="token operator">=</span> nextChildren<span class="token punctuation">[</span><span class="token operator">++</span>newStartIndex<span class="token punctuation">]</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">if</span><span class="token punctuation">(</span>oldEndIndex <span class="token operator">&lt;</span> oldStartIndex<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> newStartIndex<span class="token punctuation">;</span>i<span class="token operator">&lt;=</span>newEndIndex<span class="token punctuation">;</span>i<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">            <span class="token function">mount</span><span class="token punctuation">(</span>nextChildren<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token keyword">else</span> <span class="token keyword">if</span><span class="token punctuation">(</span>newEndIndex<span class="token operator">&lt;</span> newStartIndex<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> oldStartIndex<span class="token punctuation">;</span> i<span class="token operator">&lt;</span> oldEndIndex<span class="token punctuation">,</span>i<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">            parent<span class="token punctuation">.</span><span class="token function">removeChild</span><span class="token punctuation">(</span>prevChildren<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol>
<li>什么时候DOM需要移动</li>
<li>DOM节点是如何移动的</li>
</ol>
<p>全部遍历 -&gt; 全量diff，比较消耗内存</p>
</div></template>


