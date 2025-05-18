<script lang="ts">
  import { Mic, X, Check, Play, Pause, Square, Send } from '@lucide/svelte'
  import { scale } from 'svelte/transition'

  let recordingStatus: 'idle' | 'recording' | 'preview' = $state('idle')
  let previewPlaying = $state(false)
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
    class="ease-back-out z-10 flex size-10 cursor-pointer items-center justify-center rounded-full border duration-500 active:scale-95 active:opacity-60"
    class:w-20={recordingStatus !== 'idle'}
    class:bg-red-100={recordingStatus === 'recording'}
    class:bg-white={recordingStatus !== 'recording'}
    class:border-red-200={recordingStatus === 'recording'}
    class:border-neutral-200={recordingStatus !== 'recording'}
    onclick={() => {
      if (recordingStatus === 'idle') {
        recordingStatus = 'recording'
      } else if (recordingStatus === 'recording') {
        recordingStatus = 'preview'
        previewPlaying = false
      } else if (recordingStatus === 'preview') {
        previewPlaying = !previewPlaying
      }
    }}
  >
    {#if recordingStatus === 'idle'}
      <Mic />
    {:else if recordingStatus === 'recording'}
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
    {:else if recordingStatus === 'preview'}
      <div class="flex items-center gap-1" class:text-red-500={previewPlaying}>
        <div class="relative size-4">
          {#if previewPlaying}
            <div
              class="absolute"
              in:scale={{ delay: 100, duration: 200 }}
              out:scale={{ duration: 200 }}
            >
              <Pause fill="currentColor" size={16} />
            </div>
          {:else}
            <div
              class="absolute"
              in:scale={{ delay: 100, duration: 200 }}
              out:scale={{ duration: 200 }}
            >
              <Play fill="currentColor" size={16} />
            </div>
          {/if}
        </div>
        03s
      </div>
    {/if}
  </button>
  <button
    class="ml-1 size-10 cursor-pointer rounded-full border border-neutral-200 active:scale-95 active:opacity-60"
    class:-translate-x-11={recordingStatus === 'idle'}
    class:opacity-0={recordingStatus === 'idle'}
    class:ease-back-out={recordingStatus !== 'idle'}
    class:duration-500={recordingStatus !== 'idle'}
    class:ease-in-out={recordingStatus === 'idle'}
    class:duration-300={recordingStatus === 'idle'}
    onclick={() => (recordingStatus = recordingStatus === 'recording' ? 'preview' : 'idle')}
  >
    <div class="relative flex size-10 items-center justify-center">
      {#if recordingStatus === 'recording'}
        <div class="absolute" out:scale={{ duration: 200 }}>
          <Check class="pr-px" />
        </div>
      {:else}
        <div class="absolute" in:scale={{ delay: 100, duration: 200 }}>
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
