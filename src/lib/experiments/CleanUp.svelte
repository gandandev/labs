<script lang="ts">
  import { onMount } from 'svelte'

  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D | null = $state(null)
  let drawing = $state(false)
  let lastX = $state(0)
  let lastY = $state(0)
  let currentPath: { x: number; y: number }[] = $state([])

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
    currentPath = [{ x, y }]
  }

  function handlePointerMove(e: PointerEvent) {
    if (!drawing || !ctx) return
    const { x, y } = getPointerPos(e)

    currentPath.push({ x, y })

    if (currentPath.length < 3) {
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 20
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(lastX, lastY)
      ctx.lineTo(x, y)
      ctx.stroke()
    } else {
      const len = currentPath.length
      const p1 = currentPath[len - 3]
      const p2 = currentPath[len - 2]
      const p3 = currentPath[len - 1]

      const cp = {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2
      }

      const endPoint = {
        x: (p2.x + p3.x) / 2,
        y: (p2.y + p3.y) / 2
      }

      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 20
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(cp.x, cp.y)
      ctx.quadraticCurveTo(p2.x, p2.y, endPoint.x, endPoint.y)
      ctx.stroke()
    }

    lastX = x
    lastY = y
  }

  function handlePointerUp() {
    if (drawing && ctx && currentPath.length > 1) {
      const lastPoint = currentPath[currentPath.length - 1]
      const secondLastPoint = currentPath[currentPath.length - 2]

      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 20
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(secondLastPoint.x, secondLastPoint.y)
      ctx.lineTo(lastPoint.x, lastPoint.y)
      ctx.stroke()
    }

    drawing = false
    currentPath = []
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
    class="absolute inset-0 z-10 touch-none"
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
    onpointerleave={handlePointerUp}
  ></canvas>
</div>
