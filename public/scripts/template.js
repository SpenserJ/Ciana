var Template = function Template(data) {
  var html = data.html;
  if (($template = $('#template-' + data.name)).length === 0) {
    $('<script type="text/html" id="template-' + data.name+ '">' + html + '</script>').appendTo('head');
  } else {
    $template.html(html);
    // $.each(panels, function(index, value) {
      // if (data.template === template_name) {
        // Ciana.panels()[index].provider_object(Ciana.panels()[index].provider_object());
      // }
    // });
  }
};
