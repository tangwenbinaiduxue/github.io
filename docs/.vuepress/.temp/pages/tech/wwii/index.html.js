import comp from "D:/github.io/docs/.vuepress/.temp/pages/tech/wwii/index.html.vue"
const data = JSON.parse("{\"path\":\"/tech/wwii/\",\"title\":\"Tag WWII\",\"lang\":\"en-US\",\"frontmatter\":{\"title\":\"Tag WWII\",\"sidebar\":false,\"blog\":{\"type\":\"category\",\"name\":\"WWII\",\"key\":\"tech\"},\"layout\":\"Tag\"},\"headers\":[],\"git\":{},\"filePathRelative\":null,\"excerpt\":\"\"}")
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
