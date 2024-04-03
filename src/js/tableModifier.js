export function enableStickyHeaders() {
  // Creates a stylesheet to make the 2nd column sticky
  const sticky_headers = document.querySelectorAll('th.is-sticky')
  let css = [...sticky_headers]
    .map((header) => {
      let index = [...header.parentNode.childNodes].indexOf(header)
      return `th.is-sticky:nth-child(${index - 1}), td.is-sticky:nth-child(${index - 1}) { left: ${header.offsetLeft - 1}px !important }`
    })
    .join('')
  const style = document.createElement('style')
  style.appendChild(document.createTextNode(css))
  document.head.appendChild(style)
}

export function enableTableNavigation() {
  // Enables keyboard navigation of the input fields of the table (Shift + Arrow keys)
  const table = document.querySelector('.b-table')
  let keys

  const navigate_table = (event, direction) => {
    const td = event.target.closest('td')
    let element
    if (direction === 'up' || direction === 'down') {
      const elements = table.querySelectorAll(`[data-label="${td.getAttribute('data-label')}"]`)
      let index = [...elements].indexOf(td)
      if (direction === 'up' && index > 0) index--
      else if (direction === 'down' && index < elements.length - 1) index++
      element = elements[index]
    }
    if (direction === 'left' || direction === 'right') {
      element = direction === 'left' ? td.previousElementSibling : td.nextElementSibling
    }
    if (element && element.querySelector('input')) element.querySelector('input').select()
  }

  table.addEventListener(
    'keydown',
    (event) => {
      keys = keys || []
      keys[event.keyCode] = true
      if (keys[16] && keys[37]) {
        // If Shift + ArrowLeft
        event.preventDefault()
        navigate_table(event, 'left')
      }
      if (keys[16] && keys[38]) {
        // If Shift + ArrowUp
        event.preventDefault()
        navigate_table(event, 'up')
      }
      if (keys[16] && keys[39]) {
        // If Shift + ArrowRight
        event.preventDefault()
        navigate_table(event, 'right')
      }
      if (keys[16] && keys[40]) {
        // If Shift + ArrowDown
        event.preventDefault()
        navigate_table(event, 'down')
      }
    },
    false
  )
  table.addEventListener(
    'keyup',
    (event) => {
      keys[event.keyCode] = false
    },
    false
  )
}
