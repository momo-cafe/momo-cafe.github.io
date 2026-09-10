import wordmark from '@/assets/brand/momo-wordmark.svg?raw'

export default function Header() {
  return (
    <header id="top" class="absolute top-0 left-0 z-10 px-6 py-6">
      <a href="#top" class="inline-block w-28 text-white drop-shadow-md" innerHTML={wordmark} />
    </header>
  )
}
