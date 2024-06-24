import comp from "D:/github.io/docs/.vuepress/.temp/pages/tech/index.html.vue"
const data = JSON.parse("{\"path\":\"/tech/\",\"title\":\"Tech\",\"lang\":\"en-US\",\"frontmatter\":{\"title\":\"Tech\",\"sidebar\":false,\"blog\":{\"type\":\"category\",\"key\":\"tech\"},\"layout\":\"Tech\"},\"headers\":[],\"git\":{},\"filePathRelative\":null,\"excerpt\":\"\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
