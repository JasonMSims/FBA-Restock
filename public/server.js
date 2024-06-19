function doGet(e) {
  let params = {
    title: 'FBA Restock',
    view: 'index',
  }
  try {
    let html = HtmlService.createTemplateFromFile('index')
    html.data = { ...e.parameters, ...params }
    return html.evaluate().setTitle(params.title)
  } catch (e) {
    HtmlService.createHtmlOutput(`<pre>${e}</pre>`)
  }
}

function include(filename) {
  return HtmlService.createTemplateFromFile(filename).evaluate().getContent()
}

function view_template(template, data) {
  let html = HtmlService.createTemplateFromFile(template)
  html.data = typeof data != 'undefined' ? data : {}
  return html.evaluate().getContent()
}
