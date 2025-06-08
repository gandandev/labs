<script lang="ts">
  import { onMount } from 'svelte'

  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D | null = $state(null)
  let drawing = $state(false)
  let lastX = $state(0)
  let lastY = $state(0)

  function resizeCanvas() {
    if (canvas) {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }
  }

  function getPointerPos(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  function handlePointerDown(e: PointerEvent) {
    drawing = true
    const { x, y } = getPointerPos(e)
    lastX = x
    lastY = y
  }

  function handlePointerMove(e: PointerEvent) {
    if (!drawing || !ctx) return
    const { x, y } = getPointerPos(e)
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 20
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(x, y)
    ctx.stroke()
    lastX = x
    lastY = y
  }

  function handlePointerUp() {
    drawing = false
  }

  onMount(() => {
    ctx = canvas.getContext('2d')
    resizeCanvas()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  })
</script>

<div class="relative h-full w-full">
  <img
    src="/clean-up/image.jpg"
    alt="Example"
    class="pointer-events-none h-full w-full object-cover"
    draggable="false"
  />
  <canvas
    bind:this={canvas}
    class="absolute inset-0 touch-none"
    style="z-index:1;"
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
    onpointerleave={handlePointerUp}
  ></canvas>
</div>
