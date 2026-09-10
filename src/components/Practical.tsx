import { For } from 'solid-js'
import { practical, business, hours } from '@/data/site'

export default function Practical() {
  return (
    <section class="px-6 py-16 border-t border-neutral-200">
      <div class="max-w-2xl mx-auto grid sm:grid-cols-2 gap-10">
        <div>
          <h2 class="font-display text-2xl sm:text-3xl mb-4">praktisch</h2>
          <ul class="space-y-1 text-neutral-700">
            <For each={practical}>{(item) => <li>{item}</li>}</For>
          </ul>
        </div>

        <div>
          <h2 class="font-display text-2xl sm:text-3xl mb-4">waar</h2>
          <p class="text-neutral-700">
            {business.street}
            <br />
            {business.postcode} {business.city}
          </p>
          <a
            href={business.mapsUrl}
            target="_blank"
            rel="noreferrer"
            class="inline-block mt-3 underline underline-offset-4 text-neutral-800"
          >
            route
          </a>

          <h3 class="font-display text-lg mt-8 mb-2">openingstijden</h3>
          <ul class="text-neutral-700 space-y-1">
            <li>ma {hours.mon}</li>
            <li>di {hours.tue}</li>
            <li>wo {hours.wed}</li>
            <li>do {hours.thu}</li>
            <li>vr {hours.fri}</li>
            <li>za {hours.sat}</li>
            <li>zo {hours.sun}</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
