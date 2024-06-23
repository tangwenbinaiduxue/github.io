import comp from "D:/github.io/docs/.vuepress/.temp/pages/techstack/categoryb/index.html.vue"
const data = JSON.parse("{\"path\":\"/techstack/categoryb/\",\"title\":\"Category CategoryB\",\"lang\":\"en-US\",\"frontmatter\":{\"title\":\"Category CategoryB\",\"sidebar\":false,\"blog\":{\"type\":\"category\",\"name\":\"CategoryB\",\"key\":\"TechStack\"},\"layout\":\"Category\"},\"headers\":[],\"git\":{},\"filePathRelative\":null,\"excerpt\":\"\"}")
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
