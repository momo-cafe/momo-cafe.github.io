import { Motion } from 'solid-motionone'
import { about } from '@/data/site'

export default function About() {
  return (
    <section class="px-6 py-16 border-t border-neutral-200">
      <Motion.div
        initial={{ opacity: 0, y: 16 }}
        inView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, easing: 'ease-out' }}
        class="max-w-2xl mx-auto"
      >
        <h2 class="font-display text-2xl sm:text-3xl mb-4">{about.heading}</h2>
        <p class="text-neutral-700 leading-relaxed">{about.body}</p>
      </Motion.div>
    </section>
  )
}
