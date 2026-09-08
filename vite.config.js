import { defineConfig } from 'vite'

export default defineConfig({
  base: '',
  build: {
    outDir: 'web',
    emptyOutDir: true,
    manifest: 'manifest.json',
    rollupOptions: {
      input: 'module.html'
    }
  },
  plugins: [
    {
      name: 'remove-attributes',
      transformIndexHtml: (html) =>
        html.replaceAll(/( type="module")? crossorigin/g, '')
    }
  ]
})
