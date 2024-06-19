export const useFileDownload = () => {
  const downloadFile = (content, filename, contentType) => {
    const blob = new Blob([new Uint8Array(content)], { type: contentType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return { downloadFile }
}
