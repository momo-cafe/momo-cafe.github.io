import wordmark from '@/assets/brand/momo-wordmark.svg?raw'

export default function Header() {
  return (
    <header id="top" class="px-6 py-6">
      <a href="#top" class="inline-block w-24 text-neutral-900" innerHTML={wordmark} />
    </header>
  )
}
