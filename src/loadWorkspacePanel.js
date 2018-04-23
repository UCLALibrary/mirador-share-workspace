(function($) {

  $.LoadWorkspacePanel = function(options) {

    jQuery.extend(true, this, {
      element: null,
      appendTo: null,
    }, options);

    this.init();

  };

  $.LoadWorkspacePanel.prototype = {
    init: function () {
      this.element = jQuery(this.template()).appendTo(this.appendTo);

      this.bindEvents();
      this.listenForActions();
    },

    listenForActions: function() {
      var _this = this;
      // handle subscribed events
      _this.eventEmitter.subscribe('loadWorkspacePanelVisible.set', function(_, stateValue) {
        if (stateValue) {
          _this.show();
          jQuery('#new-workspace').show();
          jQuery('#confirm-new-workspace').hide();
          return;
        }
        _this.hide();
      });
    },

    bindEvents: function() {
      var _this = this;

      _this.element.find('#load-workspace-file').on('change', function(event) {
        // get file contents
        var file = event.target.files[0];
        var fr = new FileReader();
        var sessionID;
        fr.onload = function(event) {
          // generate new session ID
          // Due to https://github.com/ProjectMirador/mirador/issues/746, we use a hard-coded value to avoid the bug by ensuring that local storage only ever saves one workspace.
          //sessionID = $.genUUID();
          sessionID = 'saved-session';

          // load file contents into local storage, keyed by sessionID
          localStorage.setItem(sessionID, event.target.result);

          // reload page to URL with new sessionID appended
          window.location.assign(window.location.origin + window.location.pathname + '#' + sessionID);
          window.location.reload();
        };
        fr.readAsText(file);
      });

      _this.element.find('button[name="new-workspace"]').on('click', function(event) {
        jQuery('#new-workspace').hide();
        jQuery('#confirm-new-workspace').show();
      });

      _this.element.find('button[name="confirm-new-workspace"]').on('click', function(event) {
        // Drop URL fragment
        window.location.assign(window.location.origin + window.location.pathname);
      });

      _this.element.find('button[name="cancel-new-workspace"]').on('click', function(event) {
        jQuery('#new-workspace').show();
        jQuery('#confirm-new-workspace').hide();
      });
    },

    hide: function() {
      jQuery(this.element).hide({effect: "slide", direction: "up", duration: 300, easing: "swing"});
    },

    show: function() {
      jQuery(this.element).show({effect: "slide", direction: "up", duration: 300, easing: "swing"});
    },

    template: $.Handlebars.compile([
       '<div id="load-workspace-panel">',
         '<h3>{{t "loadWorkspace"}}</h3>',
         '<span>',
           '<input id="load-workspace-file" type="file"></input>',
         '</span>',
         '<h3>{{t "newWorkspace"}}</h3>',
         '<p>{{t "newWorkspaceWarning"}}</p>',
         '<span id="new-workspace">',
           '<button name="new-workspace" type="button">{{t "newWorkspaceClear"}}</button>',
         '</span>',
         '<span id="confirm-new-workspace">',
           '<button name="confirm-new-workspace" type="button">{{t "newWorkspaceConfirm"}}</button>',
           '<button name="cancel-new-workspace" type="button">{{t "newWorkspaceCancel"}}</button>',
         '</span>',
       '</div>'
    ].join(''))
  };

}(Mirador));
