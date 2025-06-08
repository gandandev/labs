<script lang="ts">
  import catalog from '$lib/catalog'
  import { formatDateRange } from '$lib/utils'
</script>

<div class="flex grid-cols-1 flex-col gap-4 p-4 md:grid md:grid-cols-2 2xl:grid-cols-3">
  <div class="relative col-span-2 flex h-96 flex-col items-center justify-center p-5 text-center">
    <span class="rounded-full border px-3 py-1 font-medium">Labs</span>
    <p class="mt-2 text-4xl font-medium tracking-tight text-balance">
      Crafting delightful UI experiences
    </p>
    <div class="mt-4 flex gap-5 text-sm">
      <a
        href="https://github.com/gandandev"
        class="rounded-full font-medium duration-150 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        @gandandev
      </a>
      <a
        href="https://github.com/gandandev/labs"
        class="rounded-full font-medium duration-150 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        View on GitHub
      </a>
    </div>
  </div>
  {#each catalog as experiment}
    <div
      class="relative flex h-96 items-center justify-center overflow-hidden rounded-2xl bg-white"
    >
      <experiment.component />
      <span
        class="absolute bottom-1 left-1 rounded-full bg-white/50 px-2 py-1 text-xs text-black/50 backdrop-blur-lg"
      >
        {formatDateRange(experiment.startDate, experiment.endDate)}
      </span>
      {#if experiment.credits}
        <a
          href={experiment.credits.url}
          class="absolute right-1 bottom-1 rounded-full bg-white/50 px-2 py-1 text-xs text-black/50 backdrop-blur-lg duration-150 hover:text-black hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Original by {experiment.credits.name}
        </a>
      {/if}
    </div>
  {/each}
</div>
