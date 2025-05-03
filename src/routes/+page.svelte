<script lang="ts">
  import catalog from '$lib/catalog'
</script>

<div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 2xl:grid-cols-3">
  <div class="relative col-span-2 flex h-96 flex-col items-center justify-center p-5 text-center">
    <span class="rounded-full border px-3 py-1 font-medium">Labs</span>
    <p class="mt-2 text-4xl font-medium tracking-tight text-balance">
      Interactions, components, and cool stuff
    </p>
    <div class="mt-4 flex gap-5 text-sm">
      <a
        href="https://github.com/gandandev"
        class="rounded-full font-medium duration-150 hover:underline"
      >
        @gandandev
      </a>
      <a
        href="https://github.com/gandandev/labs"
        class="rounded-full font-medium duration-150 hover:underline"
      >
        View on GitHub
      </a>
    </div>
  </div>
  {#each catalog as experiment}
    <div class="flex h-96 items-center justify-center rounded-2xl bg-white">
      <experiment.component />
    </div>
  {/each}
</div>
