import { For } from 'solid-js'
import { Motion } from 'solid-motionone'
import { gallery, videos } from '@/data/site'

export default function Gallery() {
  return (
    <section class="px-6 py-16 border-t border-neutral-200">
      <div class="max-w-4xl mx-auto">
        <h2 class="font-display text-2xl sm:text-3xl mb-8">binnen</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <For each={gallery}>
            {(photo) => (
              <Motion.figure
                initial={{ opacity: 0, y: 16 }}
                inView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, easing: 'ease-out' }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  class="w-full aspect-[4/3] object-cover rounded-md bg-neutral-100"
                />
                <figcaption class="mt-2 text-sm text-neutral-500">{photo.caption}</figcaption>
              </Motion.figure>
            )}
          </For>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <For each={videos}>
            {(video) => (
              <Motion.figure
                initial={{ opacity: 0, y: 16 }}
                inView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, easing: 'ease-out' }}
              >
                <video
                  src={video.src}
                  controls
                  playsinline
                  preload="metadata"
                  class="w-full aspect-[4/3] object-cover rounded-md bg-neutral-100"
                />
                <figcaption class="mt-2 text-sm text-neutral-500">{video.caption}</figcaption>
              </Motion.figure>
            )}
          </For>
        </div>
      </div>
    </section>
  )
}
