var MiradorShareWorkspace = {

    // TODO: add more locales
    locales: {
        en: {
            translation: {
                'saveWorkspace': 'Save Workspace',
                'saveWorkspaceTooltip': 'Save this workspace to your desktop',
                'saveWorkspaceWarning': 'Please do not give the filename an extension. It will be in JSON format, and a .json extension is automatically appended to the filename.',
                'saveAs': 'Save As',
                'loadWorkspace': 'Load Workspace',
                'loadWorkspaceTooltip': 'Restore a previously downloaded workspace from a file on your desktop',
            }
        }
    },

    template: Mirador.Handlebars.compile([
        '<li>',
            '<a href="javascript:;" class="save-workspace mainmenu-button" title="{{t "saveWorkspaceTooltip"}}">',
                '<span class="fa fa-download fa-lg fa-fw"></span> {{t "saveWorkspace"}}',
            '</a>',
        '</li>',
        '<li>',
            '<a href="javascript:;" class="load-workspace mainmenu-button" title="{{t "loadWorkspaceTooltip"}}">',
                '<span class="fa fa-upload fa-lg fa-fw"></span> {{t "loadWorkspace"}}',
            '</a>',
        '</li>',
    ].join('')),

    init: function() {
        var self = this;

        i18next.on('initialized', function() {
            for (var locale in self.locales) {
                // add translations from each locale
                var ns = 'translation';
                i18next.addResourceBundle(locale, ns, self.locales[locale][ns], true, true);
            };
        });

        /*
         * Mirador.MainMenu
         */
        (function($) {

            var bindEvents = $.MainMenu.prototype.bindEvents;

            $.MainMenu.prototype.bindEvents = function() {
                var _this = this;
                bindEvents.apply(this, arguments);

                // add button (the compiled template) to the DOM
                this.element.find('.mirador-main-menu').prepend(self.template());

                this.element.find('.save-workspace').on('click', function() {
                    _this.eventEmitter.publish('toggleSaveWorkspacePanel');
                    //remove active class from other buttons
                    _this.element.find('.sync-window-groups').removeClass('active');
                    if (jQuery(this).hasClass('active')) {
                        jQuery(this).removeClass('active');
                    } else {
                        jQuery(this).addClass('active');
                    }
                });

                this.element.find('.load-workspace').on('click', function() {
                    _this.eventEmitter.publish('toggleLoadWorkspacePanel');
                    //remove active class from other buttons
                    _this.element.find('.sync-window-groups').removeClass('active');
                    if (jQuery(this).hasClass('active')) {
                        jQuery(this).removeClass('active');
                    } else {
                        jQuery(this).addClass('active');
                    }
                });
            };
        })(Mirador);

        /*
         * Mirador.Viewer
         */
        (function($) {
            var constructor = $.Viewer,
                prototype = $.Viewer.prototype,
                setupViewer = $.Viewer.prototype.setupViewer,
                listenForActions = $.Viewer.prototype.listenForActions;

            $.Viewer.prototype.setupViewer = function() {
                var _this = this;
                setupViewer.apply(this, arguments);

                if (this.mainMenu) {
                    this.saveWorkspacePanel = new $.SaveWorkspacePanel({
                        appendTo: this.element.find('.mirador-viewer'),
                        state: this.state,
                        eventEmitter: this.eventEmitter
                    });

                    this.loadWorkspacePanel = new $.LoadWorkspacePanel({
                        appendTo: this.element.find('.mirador-viewer'),
                        state: this.state,
                        eventEmitter: this.eventEmitter
                    });
                }
            };

            $.Viewer.prototype.listenForActions = function() {
                var _this = this;
                listenForActions.apply(this, arguments);

                this.eventEmitter.subscribe('toggleSaveWorkspacePanel', function(event) {
                    _this.toggleSaveWorkspacePanel();
                });

                this.eventEmitter.subscribe('toggleLoadWorkspacePanel', function(event) {
                    _this.toggleLoadWorkspacePanel();
                });
            };

            $.Viewer.prototype.toggleSaveWorkspacePanel = function() {
                this.toggleOverlay('saveWorkspacePanelVisible');
            };

            $.Viewer.prototype.toggleLoadWorkspacePanel = function() {
                this.toggleOverlay('loadWorkspacePanelVisible');
            };

            $.Viewer = function() {
                return new constructor(jQuery.extend(true, Array.prototype.slice.call(arguments)[0], {
                    overlayStates: {
                        'saveWorkspacePanelVisible': false,
                        'loadWorkspacePanelVisible': false
                    }
                }));
            };
            $.Viewer.prototype = prototype;
        })(Mirador);
    }
};

$(document).ready(function() {
    MiradorShareWorkspace.init();
});
