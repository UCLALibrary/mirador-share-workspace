(function($) {

  $.UploadWorkspacePanel = function(options) {

    jQuery.extend(true, this, {
      element: null,
      appendTo: null,
    }, options);

    this.init();

  };

  $.UploadWorkspacePanel.prototype = {
    init: function () {
      this.element = jQuery(this.template()).appendTo(this.appendTo);
      
      this.bindEvents();
      this.listenForActions();
    },

    listenForActions: function() {
      var _this = this;
      // handle subscribed events
      _this.eventEmitter.subscribe('uploadWorkspacePanelVisible.set', function(_, stateValue) {
        if (stateValue) { _this.show(); return; }
        _this.hide();
      });
    },

    bindEvents: function() {
      var _this = this;

      _this.element.find('#upload-workspace-file').on('change', function(event) {
        // get file contents
        var file = event.target.files[0];
	    var fr = new FileReader();
        var sessionID;
        fr.onload = function(event) {
	      // generate new session ID
	      sessionID = $.genUUID();

          // load file contents into local storage, keyed by sessionID
	      localStorage.setItem(sessionID, event.target.result);

	      // reload page to URL with new sessionID appended
	      window.location.assign(window.location.origin + window.location.pathname + '#' + sessionID);
          window.location.reload();
        };
	    fr.readAsText(file);
      });
    },

    hide: function() {
      jQuery(this.element).hide({effect: "slide", direction: "up", duration: 300, easing: "swing"});
    },

    show: function() {
      jQuery(this.element).show({effect: "slide", direction: "up", duration: 300, easing: "swing"});
    },

    template: $.Handlebars.compile([
       '<div id="upload-workspace-panel">',
         '<h3>{{t "uploadWorkspace"}}</h3>',
         '<span>',
           '<input id="upload-workspace-file" type="file"></input>',
         '</span>',
       '</div>'
    ].join(''))
  };

}(Mirador));
