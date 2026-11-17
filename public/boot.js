// Carregador do bundle da aplicação nas páginas pré-renderizadas.
//
// O HTML dessas páginas já chega completo. Para que o JavaScript não dispute banda
// com o HTML, o CSS e as fontes em redes lentas, o bundle só começa a baixar
// depois do primeiro paint com conteúdo. O caminho do bundle é gravado pelo build
// no atributo data-entry desta tag.
;(function () {
  var current = document.currentScript
  var entry = current && current.getAttribute('data-entry')
  if (!entry) return

  var started = false
  function start() {
    if (started) return
    started = true
    var script = document.createElement('script')
    script.type = 'module'
    script.src = entry
    document.head.appendChild(script)
  }

  try {
    var observer = new PerformanceObserver(function (list) {
      var entries = list.getEntries()
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].name === 'first-contentful-paint') {
          observer.disconnect()
          setTimeout(start, 0)
          return
        }
      }
    })
    observer.observe({ type: 'paint', buffered: true })
  } catch (_) {
    // Navegador sem PerformanceObserver de paint: carrega após o evento load.
    addEventListener('load', start)
  }

  // Garantia: nunca espera mais que isso (ex.: aba aberta em segundo plano).
  setTimeout(start, 2500)
})()
