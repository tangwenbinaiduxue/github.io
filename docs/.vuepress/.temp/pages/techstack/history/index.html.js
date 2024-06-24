import comp from "D:/github.io/docs/.vuepress/.temp/pages/techstack/history/index.html.vue"
const data = JSON.parse("{\"path\":\"/techstack/history/\",\"title\":\"Category History\",\"lang\":\"en-US\",\"frontmatter\":{\"title\":\"Category History\",\"sidebar\":false,\"blog\":{\"type\":\"category\",\"name\":\"History\",\"key\":\"TechStack\"},\"layout\":\"Category\"},\"headers\":[],\"git\":{},\"filePathRelative\":null,\"excerpt\":\"\"}")
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
