<script lang="ts">
  import { onMount } from 'svelte'
  import { Calendar } from '@lucide/svelte'

  let selectedDate = $state(new Date())
  let isOpen = $state(false)

  let canvas: HTMLCanvasElement | null = $state(null)

  onMount(() => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
  })
</script>

{#if isOpen}
  <div class="relative h-full w-full bg-black">
    <canvas bind:this={canvas} class="h-full w-full"></canvas>
  </div>
{:else}
  <button
    class="transition-300 gap-2Z flex cursor-pointer items-center rounded-xl bg-neutral-100 px-3 py-2"
    onclick={() => (isOpen = true)}
  >
    <Calendar class="size-5" />
    <span>
      {selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, {selectedDate.toLocaleTimeString(
        undefined,
        { hour: 'numeric', minute: '2-digit' }
      )}
    </span>
  </button>
{/if}
