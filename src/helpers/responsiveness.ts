export function resizeRendererToDisplaySize (
  renderer: THREE.WebGLRenderer
): boolean {
  const canvas = renderer.domElement
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  const needResize = canvas.width !== width || canvas.height !== height

  // console.log(width, canvas.clientWidth)

  if (needResize) {
    /* if (import.meta.env.DEV) {
      width = Math.floor(width / 2)
      height = Math.floor(width / 2)
    } */
    renderer.setSize(width, height, false)
  }
  return needResize
}
