<script lang="ts">
  import { Trash } from '@lucide/svelte'

  let isHolding = $state(false)
  let isReadyToDelete = $state(false)
  let holdTimeout: number | undefined = $state(undefined)

  function handlePointerDown() {
    isHolding = true
    holdTimeout = setTimeout(() => {
      isReadyToDelete = true
    }, 1000)
  }

  function handlePointerUp() {
    clearTimeout(holdTimeout)
    isHolding = false
    isReadyToDelete = false
  }

  function handlePointerLeave() {
    clearTimeout(holdTimeout)
    isHolding = false
    isReadyToDelete = false
  }
</script>

<button
  class="group relative flex w-42 cursor-pointer items-center justify-center gap-2 rounded-full bg-neutral-100 py-2 duration-200 select-none active:scale-95"
  class:ring-2={isReadyToDelete}
  class:ring-red-500={isReadyToDelete}
  onpointerdown={handlePointerDown}
  onpointerup={handlePointerUp}
  onpointerleave={handlePointerLeave}
>
  <div
    aria-hidden="true"
    class="absolute flex size-5 h-full w-full items-center justify-center gap-2 rounded-full bg-red-100 text-red-500 duration-200 [clip-path:inset(0_100%_0_0)]"
    class:duration-1000={isHolding}
    class:ease-linear={isHolding}
    class:![clip-path:inset(0_0_0_0)]={isHolding}
  >
    <Trash class="size-5" />
    Hold to Delete
  </div>
  <Trash class="size-5" />
  Hold to Delete
</button>
