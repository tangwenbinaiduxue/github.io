<template><div><h1 id="vue3-diff" tabindex="-1"><a class="header-anchor" href="#vue3-diff"><span>Vue3 diff</span></a></h1>
<p>非全量Diff DOM 静态tag 有静态标记的tag的节点</p>
<p>不是双端比较了，是最长递增子序列</p>
<p>头和头比较，向后移动比较；尾和尾比较，向前比较；找到剩余部分的最长递增子序列，剩余节点插进最长递增子序列中</p>
<ol>
<li>最长递增子序列 leetcode</li>
<li>vue2 vue3 diff写出来 看代码</li>
<li>根绝vue3 简化源码 proxy reactive ast</li>
</ol>
<h2 id="vue3源码" tabindex="-1"><a class="header-anchor" href="#vue3源码"><span>vue3源码</span></a></h2>
<h3 id="编译时的核心" tabindex="-1"><a class="header-anchor" href="#编译时的核心"><span>编译时的核心</span></a></h3>
<p>compiler-core 编译原理实现的过程: 词法分析，语法分析，代码转换，代码生成   visitor关联，和babel一样</p>
</div></template>


