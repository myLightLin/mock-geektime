const user = {
  name: "<script>alert('1')</script>"
}
const vm = require('vm')
const ejs = require('ejs')
const result = `<h2>${user.name}</h2>`
const templateMap = {
  templateA: '`<h2>${include("templateB")}</h2>`',
  templateB: '`<p>hahahahah</p>`'
}

const context = {
  user,
  include: function(name) {
    return templateMap[name]()
  },
  _: function(markup) {
    if (!markup) return '';
    return String(markup)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/'/g, '&#39;')
      .replace(/"/g, '&quot;')
  }
}

Object.keys(templateMap).forEach(key => {
  const temp = templateMap[key]
  templateMap[key] = vm.runInNewContext(`
    (function() {
      return ${temp}
    })
  `, context)
})

console.log(templateMap['templateA']())
// console.log(vm.runInNewContext('', )

// const template = '<h2><%= user.name %></h2>'
// ejs.render(template, user)

