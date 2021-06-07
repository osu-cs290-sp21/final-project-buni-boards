(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['dims'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "  <div class=\"slideMenu\">\r\n        <h1 class=\"menuHeader\">Dimensions</h1>\r\n    <div class=\"slidecontainer\">\r\n      <div class=\"slideHeader\">\r\n        <h2>length</h2>\r\n        <p class=\"size\" id=\"length\">5'7</p>\r\n      </div>\r\n      <input type=\"range\" min=\"60\" max=\"84\" value=\"67\" class=\"slider\" id=\"dimSlider\">\r\n    </div>\r\n    <div class=\"slidecontainer\">\r\n      <div class=\"slideHeader\">\r\n        <h2>width</h2>\r\n        <p class=\"size\" id=\"width\">20\"3/4</p>\r\n      </div>\r\n      <input type=\"range\" min=\"10\" max=\"100\" value=\"50\" class=\"slider\" id=\"widthSlider\">\r\n    </div>\r\n    <div class=\"slidecontainer\">\r\n      <div class=\"slideHeader\">\r\n        <h2>thickness</h2>\r\n        <p class=\"size\">2\"1/2</p>\r\n      </div>\r\n      <input type=\"range\" min=\"1\" max=\"100\" value=\"50\" class=\"slider\" id=\"thicknessSlider\">\r\n    </div>\r\n  <div class=\"closeAndDownload\">\r\n    <button class=\"closeButton\"><img src=\"../_possible_photos/close-button.png\" alt=\"close button\"></button><!--\r\n    --><button class=\"downloadButton\"><img src=\"../_possible_photos/download-button.png\" alt=\"download button\"></button>\r\n  </div>\r\n  </div> ";
},"useData":true});
})();