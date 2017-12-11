(function($) {

  $.SaveWorkspacePanel = function(options) {

    jQuery.extend(true, this, {
      state: null,
      element: null,
      appendTo: null,
      eventEmitter: null,
    }, options);

    this.init();

  };

  $.SaveWorkspacePanel.prototype = {
    init: function () {
      this.element = jQuery(this.template()).appendTo(this.appendTo);

      this.bindEvents();
      this.listenForActions();
    },

    listenForActions: function() {
      var _this = this;
      // handle subscribed events
      _this.eventEmitter.subscribe('saveWorkspacePanelVisible.set', function(_, stateValue) {
        if (stateValue) { _this.show(); return; }
        _this.hide();
      });
    },

    bindEvents: function() {
      var _this = this;

      _this.element.find('.mirador-icon-save-workspace-file').off('click').on('click', function(event) {
        var input = jQuery('#save-workspace-file').val();
        var data;

        // TODO: do better input validation?
        if (input.length > 0) {

          var data = JSON.stringify(_this.state.cleanup(_this.state.get('currentConfig')));

          download(data, input + '_mirador_workspace.json', 'text/json');
          // make the text field blank
          jQuery('#save-workspace-file').val('');
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
       '<div id="save-workspace-panel">',
         '<h3>{{t "saveWorkspace"}}</h3>',
         '<span>{{t "saveAs"}}: ',
           '<input id="save-workspace-file" type="text">',
           '<a href="javascript:;" class="mirador-btn mirador-icon-save-workspace-file">',
             '<i class="fa fa-download fa-lg"></i>',
           '</a>',
         '</span>',
         '<p>{{t "saveWorkspaceWarning"}}</p>',
       '</div>'
    ].join(''))
  };

}(Mirador));
