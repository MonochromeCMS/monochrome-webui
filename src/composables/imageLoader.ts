import type { Ref } from 'vue'

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

export function useImageLoader(urls: Ref<(string | null)[][]>, currentIndex: Ref<number>) {
  const cachedImages = new Set()

  watchEffect(() => {
    const pagesToLoad = [
      urls.value[currentIndex.value - 1],
      urls.value[currentIndex.value + 1],
    ]

    for (const page of pagesToLoad) {
      if (page) {
        page.forEach((url) => {
          if (url && !cachedImages.has(url)) {
            cachedImages.add(url)
            loadImage(url)
          }
        })
      }
    }
  })
}
