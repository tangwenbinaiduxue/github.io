import comp from "D:/github.io/docs/.vuepress/.temp/pages/techstack/index.html.vue"
const data = JSON.parse("{\"path\":\"/techstack/\",\"title\":\"techStack\",\"lang\":\"en-US\",\"frontmatter\":{\"title\":\"techStack\",\"sidebar\":false,\"blog\":{\"type\":\"category\",\"key\":\"techStack\"},\"layout\":\"techStack\"},\"headers\":[],\"git\":{},\"filePathRelative\":null,\"excerpt\":\"\"}")
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
