<script lang="ts">
  import { Trash, CircleCheck } from '@lucide/svelte'
  import { fly } from 'svelte/transition'

  let isHolding = $state(false)
  let isReadyToDelete = $state(false)
  let holdTimeout: number | undefined = $state(undefined)
  let showDone = $state(false)

  function handlePointerDown(event: PointerEvent) {
    if (event.button !== 0) return
    isHolding = true
    showDone = false
    holdTimeout = setTimeout(() => {
      isReadyToDelete = true
    }, 1000)
  }

  function handlePointerUp() {
    clearTimeout(holdTimeout)
    if (isReadyToDelete) {
      showDone = true
      setTimeout(() => {
        showDone = false
      }, 2000)
    }
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
  class="group relative h-10 w-42 cursor-pointer overflow-hidden rounded-full bg-neutral-100 duration-200 select-none active:scale-95 disabled:cursor-not-allowed disabled:active:scale-100"
  class:ring-2={isReadyToDelete}
  class:ring-red-500={isReadyToDelete}
  disabled={showDone}
  onpointerdown={handlePointerDown}
  onpointerup={handlePointerUp}
  onpointerleave={handlePointerLeave}
  oncontextmenu={(event) => {
    if (isHolding) event.preventDefault()
  }}
>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 z-10 h-full w-full rounded-full bg-red-100 text-red-500 duration-200 [clip-path:inset(0_100%_0_0)]"
    class:duration-1000={isHolding}
    class:ease-linear={isHolding}
    class:![clip-path:inset(0_0_0_0)]={isHolding}
  >
    {#if showDone}
      <div
        class="absolute inset-0 flex h-full w-full items-center justify-center gap-2"
        in:fly={{ y: 40 }}
        out:fly={{ y: -40 }}
      >
        <CircleCheck class="size-5" />
        Deleted
      </div>
    {:else}
      <div
        class="absolute inset-0 flex h-full w-full items-center justify-center gap-2"
        in:fly={{ y: 40 }}
        out:fly={{ y: -40 }}
      >
        <Trash class="size-5" />
        Hold to Delete
      </div>
    {/if}
  </div>
  {#if showDone}
    <div
      class="absolute inset-0 flex h-full w-full items-center justify-center gap-2"
      in:fly={{ y: 40 }}
      out:fly={{ y: -40 }}
    >
      <CircleCheck class="size-5" />
      Deleted
    </div>
  {:else}
    <div
      class="absolute inset-0 flex h-full w-full items-center justify-center gap-2"
      in:fly={{ y: 40 }}
      out:fly={{ y: -40 }}
    >
      <Trash class="size-5" />
      Hold to Delete
    </div>
  {/if}
</button>
