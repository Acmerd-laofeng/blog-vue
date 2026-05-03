<template>
  <div class="rich-editor">
    <input type="file" ref="fileInput" accept="image/*" style="display: none" @change="handleFileChange" />
    <div v-if="editor" class="rich-editor__toolbar">
      <button
        type="button"
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
        title="加粗"
      >
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M13.5 15.5h-5v-3h5c1.1 0 2 .9 2 2s-.9 1-2 1zm-5-6V6.5h5c1.1 0 2 .9 2 2s-.9 2-2 2h-5z"/></svg>
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
        title="斜体"
      >
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
        title="删除线"
      >
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M2 12h20M10 4v3h5c.6 0 1 .4 1 1s-.4 1-1 1h-4c-1.1 0-2 .9-2 2s.9 2 2 2h6c1.1 0 2-.9 2-2s-.9-2-2-2h-6V4H10z"/></svg>
      </button>
      <div class="toolbar-divider"></div>
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        title="标题 1"
      >
        H1
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        title="标题 2"
      >
        H2
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        title="标题 3"
      >
        H3
      </button>
      <div class="toolbar-divider"></div>
      <button
        type="button"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        title="无序列表"
      >
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        title="有序列表"
      >
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v1zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>
      </button>
      <div class="toolbar-divider"></div>
      <button
        type="button"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
        title="引用"
      >
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor.isActive('codeBlock') }"
        title="代码块"
      >
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
      </button>
      <button
        type="button"
        @click="editor.chain().focus().setHorizontalRule().run()"
        title="分割线"
      >
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M2 11h20v2H2z"/></svg>
      </button>
      <div class="toolbar-divider"></div>
      <button
        type="button"
        @click="insertImage"
        title="插入图片 (URL)"
      >
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
      </button>
      <button
        type="button"
        @click="triggerUpload"
        title="上传图片 (本地)"
      >
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>
      </button>
      <button
        type="button"
        @click="insertLink"
        :class="{ 'is-active': editor.isActive('link') }"
        title="插入链接"
      >
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
      </button>
      <div class="toolbar-divider"></div>
      <button
        type="button"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().undo()"
        title="撤销"
      >
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>
      </button>
      <button
        type="button"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().redo()"
        title="重做"
      >
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>
      </button>
    </div>
    <editor-content :editor="editor" class="rich-editor__content" />
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { supabase } from '../lib/supabase'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Image.configure({
      inline: true,
      allowBase64: true
    }),
    Link.configure({
      openOnClick: false
    })
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

function insertImage() {
  const url = prompt('请输入图片地址：\n\n支持：\n- GitHub 图片链接\n- 图床链接\n- 任何 https:// 开头的图片 URL')
  if (url) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}

function insertLink() {
  const url = prompt('请输入链接地址：')
  if (url) {
    editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }
}

function triggerUpload() {
  fileInput.value.click()
}

async function handleFileChange(event) {
  const file = event.target.files[0]
  if (!file) return

  try {
    const filePath = `uploads/${Date.now()}_${file.name}`
    const { data, error } = await supabase.storage
      .from('article-images')
      .upload(filePath, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('article-images')
      .getPublicUrl(filePath)

    if (publicUrl) {
      editor.value.chain().focus().setImage({ src: publicUrl }).run()
    }
  } catch (e) {
    alert('图片上传失败：' + e.message)
  } finally {
    event.target.value = ''
  }
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
.rich-editor {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.rich-editor__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.rich-editor__toolbar button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #555;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.rich-editor__toolbar button:hover {
  background: #e0e0e0;
}

.rich-editor__toolbar button.is-active {
  background: #2C54FB;
  color: white;
}

.rich-editor__toolbar button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.toolbar-divider {
  width: 1px;
  background: #ddd;
  margin: 4px 4px;
}

.rich-editor__content {
  min-height: 300px;
  padding: 20px;
  outline: none;
  font-size: 16px;
  line-height: 1.8;
}

.rich-editor__content :deep(.ProseMirror) {
  outline: none;
}

.rich-editor__content :deep(h1) {
  font-size: 2em;
  font-weight: 700;
  margin: 0.5em 0;
}

.rich-editor__content :deep(h2) {
  font-size: 1.5em;
  font-weight: 600;
  margin: 0.5em 0;
}

.rich-editor__content :deep(h3) {
  font-size: 1.25em;
  font-weight: 600;
  margin: 0.5em 0;
}

.rich-editor__content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 1em 0;
}

.rich-editor__content :deep(blockquote) {
  border-left: 3px solid #2C54FB;
  padding-left: 1em;
  margin: 1em 0;
  color: #666;
}

.rich-editor__content :deep(code) {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.rich-editor__content :deep(pre) {
  background: #1a1a2e;
  color: #eee;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1em 0;
}

.rich-editor__content :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
}

.rich-editor__content :deep(ul),
.rich-editor__content :deep(ol) {
  padding-left: 1.5em;
  margin: 1em 0;
}

.rich-editor__content :deep(hr) {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 2em 0;
}

.rich-editor__content :deep(a) {
  color: #2C54FB;
  text-decoration: underline;
}
</style>
