import { defineStore } from 'pinia'
import { ref } from 'vue'
import { marked } from 'marked'

marked.setOptions({ breaks: true, gfm: true })

// 确保路径与你的文件结构一致：从 stores 向上到 src，再到 data/posts/*.md
const postModules = import.meta.glob('../data/posts/*.md', { eager: true, as: 'raw' })

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return null
  const frontmatter = {}
  match[1].split('\n').forEach((line) => {
    const [key, ...valueArr] = line.split(':')
    if (key && valueArr.length) {
      let value = valueArr.join(':').trim()
      if (
        (value.startsWith("'") && value.endsWith("'")) ||
        (value.startsWith('"') && value.endsWith('"'))
      ) {
        value = value.slice(1, -1)
      }
      frontmatter[key.trim()] = value
    }
  })
  return {
    attributes: frontmatter,
    body: match[2].trim(),
  }
}

export const usePostsStore = defineStore('posts', () => {
  const posts = ref([])

  function loadPosts() {
    const loaded = []
    for (const [path, raw] of Object.entries(postModules)) {
      const parsed = parseFrontmatter(raw)
      if (parsed) {
        const id = path.split('/').pop().replace('.md', '')
        loaded.push({
          id,
          ...parsed.attributes,
          body: parsed.body,
          path,
        })
      }
    }
    posts.value = loaded.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  function getPostById(id) {
    return posts.value.find((post) => post.id === id)
  }

  function renderMarkdown(content) {
    return marked(content)
  }

  loadPosts()

  return {
    posts,
    getPostById,
    renderMarkdown,
    loadPosts,
  }
})
