<script>
  import { Trash } from '@lucide/svelte'
</script>

<button
  class="group relative flex cursor-pointer items-center justify-center gap-2 rounded-full bg-neutral-100 px-4 py-2 transition-[scale,box-shadow] duration-[100ms,200ms] select-none active:scale-95 active:ring-2 active:ring-red-500 active:delay-[0ms,950ms]"
>
  <div
    aria-hidden="true"
    class="absolute flex size-5 h-full w-full items-center justify-center gap-2 rounded-full bg-red-100 text-red-500 duration-200 [clip-path:inset(0_100%_0_0)] group-active:duration-1000 group-active:ease-linear group-active:[clip-path:inset(0_0_0_0)]"
  >
    <Trash class="size-5" />
    Hold to Delete
  </div>
  <Trash class="size-5" />
  Hold to Delete
</button>
