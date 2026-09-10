import { Motion } from 'solid-motionone'
import { hero } from '@/data/site'

export default function Hero() {
  return (
    <section class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-24">
      <video
        autoplay
        muted
        loop
        playsinline
        poster="/img/hero-loop-poster.webp"
        class="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/video/hero-loop.mp4" type="video/mp4" />
      </video>
      <div class="absolute inset-0 bg-black/45" />

      <div class="relative z-10 flex w-full flex-col items-center gap-8">
        <Motion.div
          initial={{ opacity: 0, y: 16, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ duration: 0.7, easing: 'ease-out' }}
          class="@container relative w-[min(90vw,34rem)] aspect-[1400/515] drop-shadow-xl"
        >
          <img src="/img/paper-note.webp" alt="" class="absolute inset-0 h-full w-full object-contain" />
          <div class="absolute inset-0 flex items-center justify-center px-[10%] py-[16%]">
            <p class="font-display text-center leading-[1.1] text-neutral-900 text-[10.5cqw]">
              {hero.headline}
            </p>
          </div>
        </Motion.div>

        <div class="w-[85%] max-w-md">
          <Motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, easing: 'ease-out' }}
            class="text-center text-lg text-white drop-shadow-md sm:text-xl"
          >
            {hero.sub}
          </Motion.p>
        </div>
      </div>
    </section>
  )
}
