<script lang="ts">
  import { Tween } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'

  let recordingStatus: 'recording' | 'saving' | 'saved' | 'replay' = $state('recording')

  const BUTTON_DIAMETER = 48 // == h-12
  const STROKE_WIDTH = 3 // Stroke width
  const LOADER_VISIBLE_PERCENT = 0.88 // Percentage of the circle that is visible in loader mode

  const R = BUTTON_DIAMETER / 2 - STROKE_WIDTH / 2 // Radius for the circle path
  const C = 2 * Math.PI * R // Circumference of the circle path

  const loaderPath = new Tween(
    { visible: C, gap: 0 }, // Start as a full circle
    { duration: 1000, easing: cubicOut }
  )

  const currentLoaderVisible = $derived(loaderPath.current.visible)
  const currentLoaderGap = $derived(loaderPath.current.gap)

  let randomValue = $state(Math.floor(Math.random() * 1000))

  function handleStopRecording() {
    recordingStatus = 'saving'

    setTimeout(
      () => {
        recordingStatus = 'saved'

        setTimeout(() => {
          recordingStatus = 'recording'

          setTimeout(() => {
            randomValue = Math.floor(Math.random() * 1000)
          }, 600)
        }, 2000)
      },
      500 + Math.random() * 700
    )
  }

  $effect(() => {
    if (recordingStatus === 'saving') {
      loaderPath.set(
        {
          visible: C * LOADER_VISIBLE_PERCENT,
          gap: C * (1 - LOADER_VISIBLE_PERCENT)
        },
        { duration: 1000 }
      )
    } else {
      loaderPath.set({ visible: C, gap: 0 }, { duration: 500 })
    }
  })
</script>

<div
  class="flex h-20 w-96 items-center justify-between rounded-full bg-black p-4 pl-7 tracking-wide"
>
  <div class="flex flex-col gap-1.5">
    <span class="text-dynamic-island-red -ml-0.5 flex items-center gap-1.5 leading-none">
      <div class="bg-dynamic-island-red size-4 rounded-full"></div>
      0:02
    </span>
    <span class="leading-none text-white">Screen Recording</span>
  </div>
  <button
    class="relative flex aspect-square h-12 cursor-pointer items-center justify-center rounded-full duration-500 ease-out active:scale-90 active:opacity-50 disabled:pointer-events-none"
    class:opacity-75={recordingStatus === 'saving'}
    aria-label="Stop recording"
    onclick={handleStopRecording}
    disabled={recordingStatus != 'recording'}
  >
    <svg
      class="absolute inset-0 h-full w-full duration-700"
      class:scale-50={recordingStatus === 'saved'}
      class:blur-sm={recordingStatus === 'saved'}
      viewBox={`0 0 ${BUTTON_DIAMETER} ${BUTTON_DIAMETER}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx={BUTTON_DIAMETER / 2}
        cy={BUTTON_DIAMETER / 2}
        r={R}
        stroke="white"
        stroke-width={STROKE_WIDTH}
        stroke-linecap="round"
        stroke-dasharray={`${currentLoaderVisible} ${currentLoaderGap}`}
        stroke-dashoffset={recordingStatus === 'saving' || recordingStatus === 'saved'
          ? currentLoaderVisible
          : 0}
        class="origin-center"
        class:animate-[spin_1.5s_linear_infinite]={recordingStatus === 'saving' ||
          recordingStatus === 'saved'}
      />
    </svg>
    <div
      class="bg-dynamic-island-red ease-back-out size-5 origin-right overflow-hidden rounded duration-600"
      class:scale-250={recordingStatus === 'saved'}
      class:translate-x-2={recordingStatus === 'saved'}
    >
      <img
        src={`https://picsum.photos/500/500?random=${randomValue}`}
        alt="Screen Recording Preview"
        class="pointer-events-none size-full object-cover duration-500"
        class:opacity-0={recordingStatus === 'recording' || recordingStatus === 'saving'}
      />
    </div>
  </button>
</div>
