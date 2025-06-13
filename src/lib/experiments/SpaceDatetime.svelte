<script lang="ts">
  import { Calendar } from '@lucide/svelte'

  let selectedDate = $state(new Date())
  let isOpen = $state(false)
</script>

<button
  class="transition-300 gap-2Z flex cursor-pointer items-center rounded-xl bg-neutral-100 px-3 py-2"
  onclick={() => (isOpen = true)}
>
  <Calendar class="h-4 w-4" />
  <span
    >{selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, {selectedDate.toLocaleTimeString(
      undefined,
      { hour: 'numeric', minute: '2-digit' }
    )}</span
  >
</button>
