import { registerSW } from 'virtual:pwa-register'

export function setupPWA() {
  const intervalMS = 60 * 60 * 1000

  registerSW({
    onRegisteredSW(swUrl, r) {
      r && setInterval(async () => {
        if (!(!r.installing && navigator))
          return

        if (('connection' in navigator) && !navigator.onLine)
          return

        const resp = await fetch(swUrl, {
          cache: 'no-store',
          // 'cache-control': 'no-cache'
        })

        if (resp?.status === 200)
          await r.update()
      }, intervalMS)
    },
  })
}
