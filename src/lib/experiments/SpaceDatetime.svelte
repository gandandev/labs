<script lang="ts">
  import { onMount } from 'svelte'
  import { Calendar, Check, Sun } from '@lucide/svelte'
  import { versatile } from '../transitions'
  import { fly } from 'svelte/transition'
  import { backOut } from 'svelte/easing'

  let selectedDate = $state(new Date())
  let isOpen = $state(false)

  let canvas: HTMLCanvasElement | null = $state(null)

  let labelWidth = $state(0)

  let displayText = $derived(
    `${selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, ${selectedDate.toLocaleTimeString(
      undefined,
      { hour: 'numeric', minute: '2-digit' }
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
    class="flex justify-center overflow-hidden rounded-xl"
    class:mixed-transitions-open={isOpen}
    class:mixed-transitions-closed={!isOpen}
    class:h-10={!isOpen}
    class:size-full={isOpen}
    class:bg-neutral-100={!isOpen}
    class:bg-black={isOpen}
    class:cursor-pointer={!isOpen}
    style:width={!isOpen ? `${labelWidth}px` : '100%'}
    onclick={() => {
      if (!isOpen) isOpen = true
    }}
    in:fly={{ duration: 300, y: 10 }}
    role="button"
    tabindex="0"
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ' || !isOpen) {
        isOpen = true
      }
    }}
  >
    {#if isOpen}
      <canvas bind:this={canvas} class="h-full w-full"></canvas>

      <div
        class="absolute bottom-3 mx-auto flex gap-2"
        in:fly={{ duration: 300, y: 10, delay: 300, easing: backOut }}
        out:fly={{ duration: 100, y: -50 }}
      >
        <button
          class="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/75 shadow-[inset_0.7px_0.7px_0.5px_0_white,inset_-0.7px_-0.7px_0.5px_0_white] duration-200 active:scale-95 active:opacity-80"
        >
          <Sun class="size-6 pt-0.5" />
        </button>
        <button
          class="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/75 shadow-[inset_0.7px_0.7px_0.5px_0_white,inset_-0.7px_-0.7px_0.5px_0_white] duration-200 active:scale-95 active:opacity-80"
          onclick={(e) => {
            e.stopPropagation()
            isOpen = false
          }}
        >
          <Check class="size-6 pt-0.5" />
        </button>
      </div>
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
