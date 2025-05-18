<script lang="ts">
  import { Mic, X, Check, Play, Square, Send } from '@lucide/svelte'
  import { scale, blur } from 'svelte/transition'
  import { cubicIn, cubicOut } from 'svelte/easing'

  let recordingStatus: 'idle' | 'recording' | 'preview' = $state('idle')
  let previewPlaying = $state(false)

  let recordingStart = $state(0)

  const MAX_RECORDING_TIME_MS = 10000
  let recordingLiveDurationMs = $state(0)
  let recordedTotalDurationSeconds = $state(0)

  let progressPathRef: SVGPathElement | undefined = $state(undefined)
  let progressPathLength = $state(0)

  function setRecordedTotalDurationFromMs(elapsedMs: number) {
    let roundedSecs = Math.round(elapsedMs / 1000)
    if (roundedSecs === 0 && elapsedMs > 0) {
      recordedTotalDurationSeconds = 1
    } else {
      recordedTotalDurationSeconds = roundedSecs
    }
  }

  $effect(() => {
    if (progressPathRef) {
      progressPathLength = progressPathRef.getTotalLength()
    }
  })

  $effect(() => {
    let animationFrameId: number

    if (recordingStatus === 'recording') {
      const updateProgress = () => {
        const elapsed = Date.now() - recordingStart
        if (elapsed < MAX_RECORDING_TIME_MS) {
          recordingLiveDurationMs = elapsed
          animationFrameId = requestAnimationFrame(updateProgress)
        } else {
          recordingLiveDurationMs = MAX_RECORDING_TIME_MS
          if (recordingStatus === 'recording') {
            setRecordedTotalDurationFromMs(MAX_RECORDING_TIME_MS)
            recordingStatus = 'preview'
            previewPlaying = false
          }
        }
      }
      animationFrameId = requestAnimationFrame(updateProgress)
    } else {
      recordingLiveDurationMs = 0
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  })

  const pillWidth = 82 // 80 leaves a little gap on the side
  const pillHeight = 40
  const pillRadius = pillHeight / 2

  const staticPillPathD = `M ${pillWidth},${pillRadius} A ${pillRadius},${pillRadius} 0 0 1 ${pillWidth - pillRadius},${pillHeight} L ${pillRadius},${pillHeight} A ${pillRadius},${pillRadius} 0 0 1 ${pillRadius},0 L ${pillWidth - pillRadius},0 A ${pillRadius},${pillRadius} 0 0 1 ${pillWidth},${pillRadius}`

  const strokeDashoffset = $derived(() => {
    if (progressPathLength === 0) return progressPathLength
    const progress = Math.min(1, recordingLiveDurationMs / MAX_RECORDING_TIME_MS)
    return progressPathLength * (1 - progress)
  })
</script>

<div class="flex">
  <button
    class="mr-1 flex size-10 cursor-pointer items-center justify-center rounded-full border border-neutral-200 active:scale-95 active:opacity-60"
    class:translate-x-11={recordingStatus === 'idle'}
    class:opacity-0={recordingStatus === 'idle'}
    class:ease-back-out={recordingStatus !== 'idle'}
    class:ease-in-out={recordingStatus === 'idle'}
    class:duration-500={recordingStatus !== 'idle'}
    class:duration-300={recordingStatus === 'idle'}
    onclick={() => (recordingStatus = 'idle')}
  >
    <X />
  </button>
  <button
    class="ease-back-out relative z-10 flex size-10 cursor-pointer items-center justify-center rounded-full border duration-500 active:scale-95 active:opacity-60"
    class:w-20={recordingStatus !== 'idle'}
    class:bg-red-100={recordingStatus === 'recording'}
    class:bg-white={recordingStatus !== 'recording'}
    class:border-red-200={recordingStatus === 'recording'}
    class:border-neutral-200={recordingStatus !== 'recording'}
    onclick={() => {
      if (recordingStatus === 'idle') {
        recordingStatus = 'recording'
        recordingStart = Date.now()
        recordedTotalDurationSeconds = 0 // Reset for new recording
      } else if (recordingStatus === 'recording') {
        const elapsedMs = Math.min(Date.now() - recordingStart, MAX_RECORDING_TIME_MS)
        setRecordedTotalDurationFromMs(elapsedMs)
        recordingStatus = 'preview'
        previewPlaying = false
      } else if (recordingStatus === 'preview') {
        previewPlaying = !previewPlaying
      }
    }}
  >
    {#if recordingStatus === 'recording'}
      <!-- Absolute right-0 ensures progress indicator stays right-aligned during ease-back-out animation -->
      <div class="pointer-events-none absolute inset-y-0 right-0">
        <svg
          class="h-full w-full overflow-visible stroke-red-500"
          viewBox={`0 0 ${pillWidth} ${pillHeight}`}
          fill="none"
          stroke-width="2.5"
        >
          <path
            bind:this={progressPathRef}
            d={staticPillPathD}
            stroke-dasharray={progressPathLength}
            stroke-dashoffset={strokeDashoffset()}
            stroke-linecap="round"
          />
        </svg>
      </div>
    {/if}
    <div class="relative flex size-10 items-center justify-center">
      {#if recordingStatus === 'idle'}
        <div class="absolute" transition:blur={{ duration: 200, easing: cubicOut }}>
          <Mic />
        </div>
      {:else if recordingStatus === 'recording'}
        <div class="absolute" transition:blur={{ duration: 200, easing: cubicOut }}>
          <div class="flex items-center gap-1">
            {#each Array(5) as _}
              <div
                class="animate-audio-wave h-3 w-1 rounded-full bg-red-500"
                style="
              animation-duration: {200 + Math.random() * 1000}ms;
              animation-delay: {Math.random() * 100}ms;
              --wave-scale: {0.5 + Math.random() * 0.1};
              --wave-scale-max: {1 + Math.random() * 0.1};
            "
              ></div>
            {/each}
          </div>
        </div>
      {:else if recordingStatus === 'preview'}
        <div class="absolute" transition:blur={{ duration: 200, easing: cubicOut }}>
          <div
            class="flex items-center gap-1 duration-300 starting:scale-90"
            class:text-red-500={previewPlaying}
          >
            <div class="relative flex size-4 items-center justify-center">
              {#if previewPlaying}
                <div
                  class="absolute"
                  in:scale={{ delay: 100, duration: 200, easing: cubicOut }}
                  out:scale={{ duration: 200, easing: cubicIn }}
                >
                  <Square fill="currentColor" size={14} />
                </div>
              {:else}
                <div
                  class="absolute"
                  in:scale={{ delay: 100, duration: 200, easing: cubicOut }}
                  out:scale={{ duration: 200, easing: cubicIn }}
                >
                  <Play fill="currentColor" size={16} />
                </div>
              {/if}
            </div>
            {String(recordedTotalDurationSeconds).padStart(2, '0')}s
          </div>
        </div>
      {/if}
    </div>
  </button>
  <button
    class="ml-1 size-10 cursor-pointer rounded-full border border-neutral-200 active:scale-95 active:opacity-60"
    class:-translate-x-11={recordingStatus === 'idle'}
    class:opacity-0={recordingStatus === 'idle'}
    class:ease-back-out={recordingStatus !== 'idle'}
    class:duration-500={recordingStatus !== 'idle'}
    class:ease-in-out={recordingStatus === 'idle'}
    class:duration-300={recordingStatus === 'idle'}
    onclick={() => {
      if (recordingStatus === 'recording') {
        const elapsedMs = Math.min(Date.now() - recordingStart, MAX_RECORDING_TIME_MS)
        setRecordedTotalDurationFromMs(elapsedMs)
        recordingStatus = 'preview'
      } else if (recordingStatus === 'preview') {
        recordingStatus = 'idle'
      }
    }}
  >
    <div class="relative flex size-10 items-center justify-center">
      {#if recordingStatus === 'recording'}
        <div class="absolute" out:scale={{ duration: 200, easing: cubicIn }}>
          <Check class="pr-px" />
        </div>
      {:else}
        <div class="absolute" in:scale={{ delay: 100, duration: 200, easing: cubicOut }}>
          <Send class="pr-1 pb-px" />
        </div>
      {/if}
    </div>
  </button>
</div>

<style>
  .animate-audio-wave {
    animation-name: audio-wave;
    animation-iteration-count: infinite;
  }

  @keyframes audio-wave {
    0% {
      transform: scaleY(var(--wave-scale, 0.5));
    }
    50% {
      transform: scaleY(var(--wave-scale-max, 1));
    }
    100% {
      transform: scaleY(var(--wave-scale, 0.5));
    }
  }
</style>
