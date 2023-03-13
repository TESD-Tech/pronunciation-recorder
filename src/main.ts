import { ViteSSG } from 'vite-ssg'
import { setupLayouts } from 'virtual:generated-layouts'
// import Previewer from 'virtual:vue-component-preview'
import App from './App.vue'
import type { UserModule } from './types'
import generatedRoutes from '~pages'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const routes = setupLayouts(generatedRoutes)

// Add index.html aliases to fix routing when hosted by PowerSchool
routes.forEach((r) => {
  if (r.path !== '/:all(.*)*') {
    r.alias = [`${r.path.replace(/\/$/, '')}/index.html`]
    if (r.path !== '/')
      r.alias = [`${r.path.replace(/\/$/, '')}/index.html`, `${r.path.replace(/\/$/, '')}.html`]
    else
      r.alias = [`${r.path.replace(/\/$/, '')}/index.html`]
  }
})

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))
    // ctx.app.use(Previewer)
  },
)
