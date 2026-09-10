import { business, footer } from '@/data/site'

export default function Footer() {
  return (
    <footer class="px-6 py-10 border-t border-neutral-200 text-sm text-neutral-500">
      <div class="max-w-2xl mx-auto flex flex-wrap justify-between gap-4">
        <span>
          {business.name} &middot; KVK {business.kvk}
        </span>
        <a href={business.instagram} target="_blank" rel="noreferrer" class="underline underline-offset-4">
          Instagram
        </a>
        <span>{footer.credit}</span>
      </div>
    </footer>
  )
}
