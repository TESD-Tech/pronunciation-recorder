# TE Tech - Vitesse Starter Template

* Disable PWA in vite.config.ts and src/modules/pwa.ts
* Add routing workaround for index.html in main.ts

```javascript
// Add index.html aliases to fix routing when hosted by PowerSchool
routes.forEach((r) => {
  if (r.path !== '/:all(.*)*')
    r.alias = [`${r.path.replace(/\/$/, '')}/index.html`]
})
```

* Add server.proxy to vite.config.ts for remote API access

```javascript
server: {
    proxy: {
      '/api': {
        target: 'https://ps-test.tesd.net',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
```

* API Keys are loaded from .env.development.local

```javascript
VITE_PS_CLIENT_ID=XXX
VITE_PS_CLIENT_SECRET=XXX
VITE_PS_URL=https://...
```