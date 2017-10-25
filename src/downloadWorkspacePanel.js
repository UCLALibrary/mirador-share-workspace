(function($) {

  $.DownloadWorkspacePanel = function(options) {

    jQuery.extend(true, this, {
      state: null,
      element: null,
      appendTo: null,
      eventEmitter: null,
    }, options);

    this.init();

  };

  $.DownloadWorkspacePanel.prototype = {
    init: function () {
      this.element = jQuery(this.template()).appendTo(this.appendTo);
      
      this.bindEvents();
      this.listenForActions();
    },

    listenForActions: function() {
      var _this = this;
      // handle subscribed events
      _this.eventEmitter.subscribe('downloadWorkspacePanelVisible.set', function(_, stateValue) {
        if (stateValue) { _this.show(); return; }
        _this.hide();
      });
    },

    bindEvents: function() {
      var _this = this;

      _this.element.find('.mirador-icon-download-workspace-file').off('click').on('click', function(event) {
        var input = jQuery('#download-workspace-file').val();
        var link;

        // TODO: do better input validation?
        if (input.length > 0) {

          // create a fake link and click it
          link = document.createElement('a');
          link.href = "data:text/json;charset=utf8," + encodeURIComponent(JSON.stringify(_this.state.cleanup(_this.state.get('currentConfig'))));
          link.download = input + '.json';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
           
          // make the text field blank and submit the saved value to the lockController
          jQuery('#download-workspace-file').val('');
        }
        else {
          alert('Please choose a name with non-zero length.');
        }
      });
    },

    hide: function() {
      jQuery(this.element).hide({effect: "slide", direction: "up", duration: 300, easing: "swing"});
    },

    show: function() {
      jQuery(this.element).show({effect: "slide", direction: "up", duration: 300, easing: "swing"});
    },

    template: $.Handlebars.compile([
       '<div id="download-workspace-panel">',
         '<h3>{{t "downloadWorkspace"}}</h3>',
         '<span>{{t "saveAs"}}: ',
           '<input id="download-workspace-file" type="text">',
           '<a href="javascript:;" class="mirador-btn mirador-icon-download-workspace-file">',
             '<i class="fa fa-download fa-lg"></i>',
           '</a>',
         '</span>',
         '<p>{{t "downloadWorkspaceWarning"}}</p>',
       '</div>'
    ].join(''))
  };

}(Mirador));
