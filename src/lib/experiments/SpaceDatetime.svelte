<script lang="ts">
  import { onMount } from 'svelte'
  import { Calendar, Check } from '@lucide/svelte'
  import { versatile } from '../transitions'
  import { fly } from 'svelte/transition'
  import { backOut, cubicOut } from 'svelte/easing'

  let selectedDate = $state(new Date())
  let isOpen = $state(false)

  let labelWidth = $state(0)
  let isEarthDragging = $state(false)
  let isMoonDragging = $state(false)
  let earthAngle = $state(0)
  let moonAngle = $state(0)

  const sunCenterX = 960
  const sunCenterY = 540
  const orbitRadiusX = 563 // Semi-major axis (960 - 397)
  const orbitRadiusY = 299 // Semi-minor axis (540 - 240.5)

  const moonOrbitRadius = 120

  let earthX = $derived(sunCenterX + orbitRadiusX * Math.sin(earthAngle))
  let earthY = $derived(sunCenterY - orbitRadiusY * Math.cos(earthAngle))

  let moonX = $derived(earthX + moonOrbitRadius * Math.sin(moonAngle))
  let moonY = $derived(earthY - moonOrbitRadius * Math.cos(moonAngle))

  let calculatedDate = $derived.by(() => {
    const normalizedEarthAngle = ((earthAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)

    // Map angle to day of year (0° = January 1st, full rotation = full year)
    const dayOfYear = Math.floor((normalizedEarthAngle / (2 * Math.PI)) * 365.25)

    const currentYear = new Date().getFullYear()
    const startOfYear = new Date(currentYear, 0, 1)

    const newDate = new Date(startOfYear)
    newDate.setDate(startOfYear.getDate() + dayOfYear)

    return newDate
  })

  let calculatedTime = $derived.by(() => {
    const normalizedMoonAngle = ((moonAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)

    // Full moon orbit = 24 hours (1 day)
    const totalSecondsInDay = 24 * 60 * 60
    const secondsFromMoonPosition = Math.floor(
      (normalizedMoonAngle / (2 * Math.PI)) * totalSecondsInDay
    )

    const hours = Math.floor(secondsFromMoonPosition / 3600)
    const minutes = Math.floor((secondsFromMoonPosition % 3600) / 60)
    const seconds = secondsFromMoonPosition % 60

    return { hours, minutes, seconds }
  })

  // Merge calculated date and time
  let mergedDateTime = $derived.by(() => {
    const mergedDate = new Date(calculatedDate)
    mergedDate.setHours(calculatedTime.hours, calculatedTime.minutes, calculatedTime.seconds, 0)
    return mergedDate
  })

  $effect(() => {
    selectedDate = mergedDateTime
  })

  let displayText = $derived(
    `${selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, ${selectedDate.toLocaleTimeString(
      undefined,
      { hour: 'numeric', minute: '2-digit' }
    )}`
  )

  function handleMouseDown(e: MouseEvent) {
    isEarthDragging = true
    e.preventDefault()
  }

  function handleMoonMouseDown(e: MouseEvent) {
    isMoonDragging = true
    e.preventDefault()
    e.stopPropagation()
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isEarthDragging && !isMoonDragging) return

    const svg = e.currentTarget as SVGElement
    const rect = svg.getBoundingClientRect()
    const mouseX = ((e.clientX - rect.left) / rect.width) * 1920
    const mouseY = ((e.clientY - rect.top) / rect.height) * 1080

    if (isEarthDragging) {
      const deltaX = mouseX - sunCenterX
      const deltaY = mouseY - sunCenterY
      earthAngle = Math.atan2(deltaX, -deltaY)
    }

    if (isMoonDragging) {
      const deltaX = mouseX - earthX
      const deltaY = mouseY - earthY
      moonAngle = Math.atan2(deltaX, -deltaY)
    }
  }

  function handleMouseUp() {
    isEarthDragging = false
    isMoonDragging = false
  }

  onMount(() => {
    earthAngle = 0
    moonAngle = 0

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
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
      <svg
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onmousemove={handleMouseMove}
        role="img"
        class:cursor-grabbing={isEarthDragging || isMoonDragging}
        in:versatile={{
          blur: {
            duration: 500,
            from: 10,
            to: 0
          },
          scale: {
            duration: 1000,
            from: 0,
            to: 1
          },
          opacity: {
            duration: 200,
            from: 0,
            to: 1
          },
          easing: cubicOut
        }}
        out:versatile={{
          blur: {
            duration: 300,
            from: 10,
            to: 0
          },
          scale: {
            duration: 300,
            from: 0,
            to: 1
          },
          opacity: {
            duration: 200,
            from: 0,
            to: 1
          },
          easing: cubicOut
        }}
      >
        <!-- Sun -->
        <circle cx="960" cy="540" r="50" fill="#FF0000" />

        <!-- Earth orbit -->
        <path
          d="M960 240.5C1115.4 240.5 1256.07 274.01 1357.87 328.163C1459.69 382.328 1522.5 457.071 1522.5 539.5C1522.5 621.929 1459.69 696.672 1357.87 750.837C1256.07 804.99 1115.4 838.5 960 838.5C804.597 838.5 663.931 804.99 562.134 750.837C460.315 696.672 397.5 621.929 397.5 539.5C397.5 457.071 460.315 382.328 562.134 328.163C663.931 274.01 804.597 240.5 960 240.5Z"
          stroke-width="5"
          stroke="white"
        />

        <!-- Moon orbit around Earth -->
        <circle
          cx={earthX}
          cy={earthY}
          r={moonOrbitRadius}
          stroke="rgba(255, 255, 255, 0.4)"
          stroke-width="2"
          fill="none"
          stroke-dasharray="8,4"
        />

        <!-- Earth -->
        <circle
          cx={earthX}
          cy={earthY}
          r="50"
          fill="#00F43D"
          class="cursor-grab active:cursor-grabbing"
          class:cursor-grabbing={isEarthDragging}
          onmousedown={handleMouseDown}
          role="button"
          tabindex="0"
        />

        <!-- Moon -->
        <circle
          cx={moonX}
          cy={moonY}
          r="20"
          fill="#C0C0C0"
          class="cursor-grab active:cursor-grabbing"
          class:cursor-grabbing={isMoonDragging}
          onmousedown={handleMoonMouseDown}
          role="button"
          tabindex="0"
        />
      </svg>

      <div
        class="absolute bottom-3 mx-auto flex gap-2"
        in:fly={{ duration: 300, y: 10, delay: 300, easing: backOut }}
        out:fly={{ duration: 100, y: -50, delay: 75, easing: backOut }}
      >
        <span
          class="flex h-10 w-42 items-center justify-center rounded-full bg-white/25 text-white shadow-[inset_0.7px_0.7px_0.5px_0_rgba(255,255,255,0.4),inset_-0.7px_-0.7px_0.5px_0_rgba(255,255,255,0.4)]"
        >
          {displayText}
        </span>

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
        transition:versatile={{
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
      background-color 500ms ease;
  }

  .mixed-transitions-closed {
    --ease-back-out-small: cubic-bezier(0.4, 1.2, 0.5, 1);
    transition:
      width 500ms 75ms var(--ease-back-out-small),
      height 500ms 75ms var(--ease-back-out-small),
      background-color 400ms 75ms ease;
  }
</style>
