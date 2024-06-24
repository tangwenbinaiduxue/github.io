import comp from "D:/github.io/docs/.vuepress/.temp/pages/tech/categorya/index.html.vue"
const data = JSON.parse("{\"path\":\"/tech/categorya/\",\"title\":\"Category CategoryA\",\"lang\":\"en-US\",\"frontmatter\":{\"title\":\"Category CategoryA\",\"sidebar\":false,\"blog\":{\"type\":\"category\",\"name\":\"CategoryA\",\"key\":\"tech\"},\"layout\":\"Category\"},\"headers\":[],\"git\":{},\"filePathRelative\":null,\"excerpt\":\"\"}")
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
