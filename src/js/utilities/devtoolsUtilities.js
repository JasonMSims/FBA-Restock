export const injectDevTools = () => {
  const script = document.createElement('script')
  script.src = 'http://localhost:8098'
  document.head.appendChild(script)
}
