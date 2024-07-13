---
category: vue3源码学习记录
---

# Vue3 diff
非全量Diff DOM 静态tag 有静态标记的tag的节点

不是双端比较了，是最长递增子序列 

头和头比较，向后移动比较；尾和尾比较，向前比较；找到剩余部分的最长递增子序列，剩余节点插进最长递增子序列中

1. 最长递增子序列 leetcode
2. vue2 vue3 diff写出来 看代码
3. 根绝vue3 简化源码 proxy reactive ast

## vue3源码
### 编译时的核心

compiler-core 编译原理实现的过程: 词法分析，语法分析，代码转换，代码生成   visitor关联，和babel一样



