var Template = function Template(data) {
  var html = data.html;
  if (typeof data.js !== 'undefined') {
    var js = recursiveUnstringifyFunctions(data.js);
    if (typeof js.bindingHandlers !== 'undefined') {
      var bindingHandlerKeys = Object.keys(js.bindingHandlers), bindingHandlerIndex;
      for (bindingHandlerIndex = 0; bindingHandlerIndex < bindingHandlerKeys.length; bindingHandlerIndex++) {
        ko.bindingHandlers[bindingHandlerKeys[bindingHandlerIndex]] = js.bindingHandlers[bindingHandlerKeys[bindingHandlerIndex]];
      }
    }
  }
  if (($template = $('#template-' + data.name)).length === 0) {
    $('<script type="text/html" id="template-' + data.name+ '">' + html + '</script>').appendTo('body');
  } else {
    $template.html(html);
  }
};
