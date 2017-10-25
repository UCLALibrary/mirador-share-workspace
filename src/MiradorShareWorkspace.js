var MiradorShareWorkspace = {

    // TODO: add more locales
    locales: {
        en: {
            translation: {
                'downloadWorkspace': 'Download Workspace',
                'downloadWorkspaceTooltip': 'Sace this workspace to your desktop',
                'downloadWorkspaceWarning': 'Please do not give the filename an extension. It will be in JSON format, and a .json extension is automatically appended to the filename.',
                'saveAs': 'Save As',
                'uploadWorkspace': 'Upload Workspace',
                'uploadWorkspaceTooltip': 'Restore a previously downloaded workspace',
            }
        }
    },

    template: Mirador.Handlebars.compile([
        '<li>',
            '<a href="javascript:;" class="download-workspace mainmenu-button" title="{{t "downloadWorkspaceTooltip"}}">',
                '<span class="fa fa-download fa-lg fa-fw"></span> {{t "downloadWorkspace"}}',
            '</a>',
        '</li>',
        '<li>',
            '<a href="javascript:;" class="upload-workspace mainmenu-button" title="{{t "uploadWorkspaceTooltip"}}">',
                '<span class="fa fa-upload fa-lg fa-fw"></span> {{t "uploadWorkspace"}}',
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

                this.element.find('.download-workspace').on('click', function() {
                    _this.eventEmitter.publish('toggleDownloadWorkspacePanel');
                    //remove active class from other buttons
                    _this.element.find('.sync-window-groups').removeClass('active');
                    if (jQuery(this).hasClass('active')) {
                        jQuery(this).removeClass('active');
                    } else {
                        jQuery(this).addClass('active');
                    }
                });

                this.element.find('.upload-workspace').on('click', function() {
                    _this.eventEmitter.publish('toggleUploadWorkspacePanel');
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
                    this.downloadWorkspacePanel = new $.DownloadWorkspacePanel({
                        appendTo: this.element.find('.mirador-viewer'),
                        state: this.state,
                        eventEmitter: this.eventEmitter
                    });

                    this.uploadWorkspacePanel = new $.UploadWorkspacePanel({
                        appendTo: this.element.find('.mirador-viewer'),
                        state: this.state,
                        eventEmitter: this.eventEmitter
                    });
                }
            };

            $.Viewer.prototype.listenForActions = function() {
                var _this = this;
                listenForActions.apply(this, arguments);

                this.eventEmitter.subscribe('toggleDownloadWorkspacePanel', function(event) {
                    _this.toggleDownloadWorkspacePanel();
                });

                this.eventEmitter.subscribe('toggleUploadWorkspacePanel', function(event) {
                    _this.toggleUploadWorkspacePanel();
                });
            };

            $.Viewer.prototype.toggleDownloadWorkspacePanel = function() {
                this.toggleOverlay('downloadWorkspacePanelVisible');
            };

            $.Viewer.prototype.toggleUploadWorkspacePanel = function() {
                this.toggleOverlay('uploadWorkspacePanelVisible');
            };

            $.Viewer = function() {
                return new constructor(jQuery.extend(true, Array.prototype.slice.call(arguments)[0], {
                    overlayStates: {
                        'downloadWorkspacePanelVisible': false,
                        'uploadWorkspacePanelVisible': false
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
