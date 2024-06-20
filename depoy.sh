set -e

npm run docs:build

cd docs/.vuepress/dist

git init

git branch -m master main

git add -A

git commit -m "deploy"

git push -f https://github.com/tangwenbinaiduxue/github.io.git main