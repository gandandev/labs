<script lang="ts">
  import { onMount } from 'svelte'
  import { Calendar } from '@lucide/svelte'
  import { versatile } from '../transitions'
  import { fly } from 'svelte/transition'

  let selectedDate = $state(new Date())
  let isOpen = $state(false)

  let canvas: HTMLCanvasElement | null = $state(null)

  let labelWidth = $state(0)

  let displayText = $derived(
    `${selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, ${selectedDate.toLocaleTimeString(
      undefined,
      { hour: 'numeric', minute: '2-digit', second: '2-digit' }
    )}`
  )

  onMount(() => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
  })
</script>

{#if labelWidth > 0}
  <div
    class="flex justify-center rounded-xl"
    class:mixed-transitions-open={isOpen}
    class:mixed-transitions-closed={!isOpen}
    class:h-10={!isOpen}
    class:size-full={isOpen}
    class:bg-neutral-100={!isOpen}
    class:bg-black={isOpen}
    class:cursor-pointer={!isOpen}
    style:width={!isOpen ? `${labelWidth}px` : '100%'}
    onclick={() => (isOpen = !isOpen)}
    in:fly={{ duration: 300, y: 10 }}
    role="button"
    tabindex="0"
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        isOpen = !isOpen
      }
    }}
  >
    {#if isOpen}
      <canvas bind:this={canvas} class="h-full w-full"></canvas>
    {:else}
      <div
        class="absolute inset-0 mx-auto flex items-center justify-center gap-2"
        style:width={`${labelWidth}px`}
        in:versatile={{
          blur: {
            duration: 300,
            from: 10,
            to: 0
          },
          scale: {
            duration: 300,
            from: 1.2,
            to: 1
          },
          opacity: {
            duration: 300,
            from: 0,
            to: 1
          }
        }}
        out:versatile={{
          blur: {
            duration: 300,
            from: 10,
            to: 0
          },
          scale: {
            duration: 300,
            from: 1.2,
            to: 1
          },
          opacity: {
            duration: 200,
            from: 0,
            to: 1
          }
        }}
      >
        <Calendar class="size-5" />
        <span>{displayText}</span>
      </div>
    {/if}
  </div>
{/if}

<!-- Invisible element used to measure the width of the date label -->
<div
  bind:clientWidth={labelWidth}
  class="invisible absolute flex h-10 items-center gap-2 px-3 whitespace-nowrap"
  aria-hidden="true"
>
  <Calendar class="size-5" />
  <span>{displayText}</span>
</div>

<style>
  .mixed-transitions-open {
    --ease: cubic-bezier(0.5, 0, 0.3, 1);
    transition:
      width 300ms var(--ease),
      height 300ms var(--ease),
      background-color 500ms ease,
      cursor 500ms ease;
  }

  .mixed-transitions-closed {
    --ease-back-out-small: cubic-bezier(0.4, 1.2, 0.5, 1);
    transition:
      width 500ms var(--ease-back-out-small),
      height 500ms var(--ease-back-out-small),
      background-color 300ms ease,
      cursor 500ms ease;
  }
</style>
