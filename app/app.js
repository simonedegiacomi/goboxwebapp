'use strict';

/** 
 * @author Degiacomi Simone
 * @name goboxWebappApp
 * @description
 * # goboxWebappApp
 *
 * Main module of the application.
 */
angular
    .module('goboxWebapp', [
        'ngAnimate',
        'ngImgCrop',
        'ui.router',
        'ngMaterial',
        'ngMessages',
        'ngFileUpload',
        'vcRecaptcha',
        'ngSanitize',
        'ngClipboard',
        'com.2fdevs.videogular',
        'com.2fdevs.videogular.plugins.controls',
        'com.2fdevs.videogular.plugins.overlayplay'
    ])

.config(function($stateProvider, $urlRouterProvider, StateRule) {

    /**
     * Route config
     * 
     * The data field contains extra stuff used by this application, not by ui-router.
     * If in the data object the object with the key access is present, this means that
     * the access to that state is restriced by 2 rules:
     * - logged: If the user should or must (not) be logged
     * - clientReady: this indicate if the GoBoxClient can or must (not) be ready.
     * 
     * NB: If the clientReady property is set to must and the logged property is set
     * to can or must not, the clientReady rule is ignored
     */
    $stateProvider
    // This state is active only when the user is not logged
        .state('login', {
        url: '/login',
        templateUrl: 'states/login/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'LoginCtrl',
        data: {
            access: {
                logged: StateRule.MUST_NOT // The user must not be logged
            }
        }
    })

    // State for the preview of a shared file
    .state('public_file', {
        url: '/public_file/:hostName/:id',
        templateUrl: 'states/publicfile/publicfile.html',
        controller: 'PublicFileCtrl',
        controllerAs: 'PublicFileCtrl',
        data: {
            access: {
                logged: StateRule.CAN,
                clientReady: StateRule.CAN
            }
        }
    })

    // This is the main state. When the user is logged this state is alway on.
    // This contains the sidenav
    .state('home', {
        abstract: true,
        views: {
            '': {
                templateUrl: 'states/home/home.html',
                controller: 'HomeCtrl',
                controllerAs: 'HomeCtrl'
            },
            'sidenav@home': {
                templateUrl: 'states/home/sidenav/sidenav.html',
                controller: 'SidenavCtrl',
                controllerAs: 'SidenavCtrl'
            },
            'toolbar@home': {
                templateUrl: 'states/home/toolbar/toolbar.html',
                controller: 'ToolbarCtrl',
                controllerAs: 'ToolbarCtrl'
            }
        },
        data: {
            access: {
                logged: StateRule.MUST, // The client must be ready
                clientReady: StateRule.MUST // The user must be logged
            }
        }
    })

    // This state is active when the user wants see his file. This
    // state live in the 'home' state.
    // This contains the sidenav with the search button
    .state('home.files', {
        url: '/files/:id',
        views: {
            'main@home': {
                templateUrl: 'states/home/files/files.html',
                controller: 'FileListCtrl',
                controllerAs: 'FileListCtrl'
            }
        },
        params: {
            id: '1'
        }
    })

    // State with the list of the shared files
    .state('home.share', {
        url: '/share',
        views: {
            'main@home': {
                templateUrl: 'states/home/share/share.html',
                controller: 'ShareCtrl',
                controllerAs: 'ShareCtrl'
            }
        }
    })

    // This state show the files. In the sidenav you'll see the pwd. When the user
    // will click the search button the state 'search' is activated.
    .state('home.filter', {
        url: '/search/:kind/:keyword',
        views: {
            'main@home': {
                templateUrl: 'states/home/filter/filter.html',
                controller: 'FilterCtrl',
                controllerAs: 'FilterCtrl'
            }
        }
    })

    .state('home.recent', {
        url: '/recent',
        views: {
            'main@home': {
                templateUrl: 'states/home/recent/recent.html',
                controller: 'RecentCtrl',
                controllerAs: 'RecentCtrl'
            }
        }
    })

    .state('home.trash', {
        url: '/trash',
        views: {
            'main@home': {
                templateUrl: 'states/home/trash/trash.html',
                controller: 'TrashCtrl',
                controllerAs: 'TrashCtrl'
            }
        }
    })

    // This state show the setting page
    .state('home.settings', {
        url: '/settings',
        views: {
            'main@home': {
                templateUrl: 'states/home/settings/settings.html',
                controller: 'SettingsCtrl'
            }
        },
        data: {
            access: {
                clientReady: StateRule.CAN // The user can change settings even if
                    // the client is not ready (but must be logged!).
            }
        }
    })

    // This state show the loading page with some information and istruction
    .state('loading', {
        url: '/loading?first',
        controller: 'LoadingCtrl',
        templateUrl: 'states/loading/loading.html',
        data: {
            access: {
                logged: StateRule.MUST, // The user must be logged
                clientReady: StateRule.MUST_NOT // The client must not be ready
            }
        }
    });

    // The default state is the file list of the root
    $urlRouterProvider.otherwise("/login");
})

.run(function($rootScope, GoBoxClient, Preferences, GoBoxAuth,  GoBoxState, $state, $timeout, StateRule) {

        localStorage.setItem('listView', 'list');
        console.log(localStorage);

        GoBoxClient.setOnDisconnectListener(function() {
            $state.go('loading');
        });

        var lastWantedState = {
            name: 'home.files',
            params: {
                id: 1
            }
        };

        // Configure routing policy
        $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {


            // If the login doesn't matter, let the user to the next state
            if (toState.data.access.logged == StateRule.CAN) {
                return;
            }

            GoBoxAuth.isLogged().then(function(logged) {

                // If the user is logged but the next state doesn't want it
                if (logged && toState.data.access.logged == StateRule.MUST_NOT) {

                    // Go to the root file list
                    event.preventDefault();
                    $state.go('home.files');
                    return;
                }

                // If the user is not logged, but the state wants it
                if (!logged && toState.data.access.logged == StateRule.MUST) {

                    // Redirect to login
                    event.preventDefault();
                    $state.go('login');
                    return;
                }

                if (!logged && toState.data.access.logged == StateRule.MUST_NOT) {
                    return;
                }

                // If the client is ready but the state doesn't want it
                if (GoBoxClient.isReady() && toState.data.access.clientReady == StateRule.MUST_NOT) {

                    // Redirect to the home
                    event.preventDefault();
                    $state.go('home.files');
                    return;
                }

                // If the client is not ready, but the next state wants it
                if (!GoBoxClient.isReady()) {

                    // Save this state if is not the loading, so when the client is connected
                    // the user see the state that he want now
                    if (toState.name != 'loading') {
                        lastWantedState.name = toState.name;
                        lastWantedState.params = toStateParams;
                    }

                    var init = function() {
                        GoBoxClient.init().then(function() {

                            // Connected! go to the home
                            $state.go(lastWantedState.name, lastWantedState.params);
                        }, function() {

                            // Not ready... retry soon
                            $timeout(function() {
                                console.log("retry");
                                init();
                            }, 5000);
                        });
                    };

                    // Try to connect
                    init();

                    if (toState.data.access.clientReady == StateRule.MUST) {
                        // Go to the loading state
                        event.preventDefault();
                        $state.go('loading');
                    }

                }
            });

        });
    })
    .config(function(ngClipProvider) {
        ngClipProvider.setPath("bower_components/zeroclipboard/dist/ZeroClipboard.swf");
    });