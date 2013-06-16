var Template = function Template(data) {
  var html = data.html;
  if (($template = $('#template-' + data.name)).length === 0) {
    $('<script type="text/html" id="template-' + data.name+ '">' + html + '</script>').appendTo('body');
  } else {
    $template.html(html);
  }
};
