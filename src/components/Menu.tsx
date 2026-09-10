import { For } from 'solid-js'
import { Motion } from 'solid-motionone'
import { menu } from '@/data/site'

export default function Menu() {
  return (
    <section class="px-6 py-16 border-t border-neutral-200">
      <div class="max-w-2xl mx-auto">
        <h2 class="font-display text-2xl sm:text-3xl mb-2">de kaart</h2>
        <p class="text-sm text-neutral-500 mb-10">{menu.orderNotice}</p>

        <For each={menu.sections}>
          {(section) => (
            <Motion.div
              initial={{ opacity: 0, y: 16 }}
              inView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, easing: 'ease-out' }}
              class="mb-10"
            >
              <h3 class="font-display text-xl mb-4">{section.heading}</h3>

              <ul class="space-y-2">
                <For each={section.items}>
                  {(item) => (
                    <li class="flex justify-between gap-4">
                      <div>
                        <span>{item.name}</span>
                        {item.note && (
                          <span class="block text-sm text-neutral-500">{item.note}</span>
                        )}
                      </div>
                      <span class="whitespace-nowrap text-neutral-600">{item.price}</span>
                    </li>
                  )}
                </For>
              </ul>

              {section.options && (
                <>
                  <p class="mt-2 text-neutral-600">{section.groupPrice}</p>
                  <ul class="mt-1 space-y-1 text-neutral-700">
                    <For each={section.options}>{(option) => <li>{option}</li>}</For>
                  </ul>
                </>
              )}

              {section.footnote && (
                <p class="mt-3 text-sm text-neutral-500 whitespace-pre-line">{section.footnote}</p>
              )}
            </Motion.div>
          )}
        </For>

        <p class="text-sm text-neutral-500">{menu.allergenNotice}</p>
      </div>
    </section>
  )
}
