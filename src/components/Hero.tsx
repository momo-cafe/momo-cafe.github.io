import { Motion } from 'solid-motionone'
import { hero } from '@/data/site'

export default function Hero() {
  return (
    <section class="min-h-screen flex flex-col justify-center px-6 py-24">
      <Motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, easing: 'ease-out' }}
        class="font-display text-5xl sm:text-7xl leading-tight max-w-3xl"
      >
        {hero.headline}
      </Motion.h1>
      <Motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, easing: 'ease-out' }}
        class="mt-6 text-lg sm:text-xl text-neutral-600 max-w-xl"
      >
        {hero.sub}
      </Motion.p>
    </section>
  )
}
