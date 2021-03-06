(function () {
  var options = INSTALL_OPTIONS
  var Node = window.Node
  var autolinker
  var ineligibleTags = [
    'a',
    'script',
    'br',
    'col',
    'command',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
    'video',
    'iframe'
  ]

  var sanitizer = document.createElement('textarea')

  function parse (node) {
    if (node.nodeType === Node.ELEMENT_NODE && ineligibleTags.indexOf(node.tagName.toLowerCase()) !== -1) {
      return
    }

    for (var i = 0; i < node.childNodes.length; i++) {
      parse(node.childNodes[i])
    }

    if (node.nodeType === Node.TEXT_NODE) {
      var serializer = document.createElement('div')
      var fragment = document.createDocumentFragment()

      sanitizer.textContent = node.textContent
      serializer.innerHTML = autolinker.link(sanitizer.innerHTML)

      var serialChild
      while (serialChild = serializer.firstChild) { // eslint-disable-line no-cond-assign
        fragment.appendChild(serialChild)
      }

      node.parentNode.replaceChild(fragment, node)
    }
  }

  function bootstrap () {
    var parentNode

    try {
      parentNode = document.querySelector(options.advanced.location)
    } catch (e) {
      parentNode = document.body
    }

    autolinker = new window.Autolinker({
      urls: {
        schemeMatches: true,
        wwwMatches: true,
        tldMatches: true
      },
      email: options.email,
      phone: options.phone,
      mention: options.mention === 'none' ? false : options.mention,
      hashtag: options.hashtag === 'none' ? false : options.hashtag,
      stripPrefix: options.advanced.stripPrefix,
      newWindow: options.advanced.newWindow,
      truncate: {
        length: 0,
        location: 'end'
      },
      stripTrailingSlash: true,
      className: INSTALL_ID === 'preview' ? 'cf-app-autolink-preview' : ''
    })

    parse(parentNode)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap)
  } else {
    bootstrap()
  }

  window.INSTALL_SCOPE = {
    setOptions: function setOptions (nextOptions) {
      options = nextOptions

      var links = document.querySelectorAll('.cf-app-autolink-preview')

      for (var i = 0; i < links.length; i++) {
        var link = links[i]
        var textNode = document.createTextNode(link.href)

        link.parentNode.replaceChild(textNode, link)
      }

      bootstrap()
    }
  }
}())
