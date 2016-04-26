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
        'com.2fdevs.videogular',
        'com.2fdevs.videogular.plugins.controls',
        'com.2fdevs.videogular.plugins.overlayplay',
        'com.2fdevs.videogular.plugins.buffering'
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
            },
            'sidenav@home': {
                templateUrl: 'states/home/sidenav/sidenav.html',
                controller: 'SidenavCtrl'
            },
            'toolbar@home': {
                templateUrl: 'states/home/toolbar/toolbar.html',
                controller: 'ToolbarCtrl'
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
                controller: 'FileListCtrl'
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
                controller: 'FilterCtrl'
            }
        }
    })

    .state('home.recent', {
        url: '/recent',
        views: {
            'main@home': {
                templateUrl: 'states/home/recent/recent.html',
                controller: 'RecentCtrl'
            }
        }
    })


    .state('home.trash', {
        url: '/trash',
        views: {
            'main@home': {
                templateUrl: 'states/home/trash/trash.html',
                controller: 'TrashCtrl'
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
        url: '/loading',
        controller: 'LoadingCtrl',
        templateUrl: 'states/home/loading/loading.html',
        data: {
            access: {
                logged: StateRule.MUST, // The user must be logged
                clientReady: StateRule.MUST_NOT // The client must not be ready
            }
        }
    });

    // The default state is the file list of the root
    $urlRouterProvider.otherwise("/files");
})

.run(function($rootScope, GoBoxClient, GoBoxState, $state, $timeout, StateRule) {

    // Configure routing policy
    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {

        // If the login doesn't matter, let the user to the next state
        if (toState.data.access.logged == StateRule.CAN) {
            return;
        }

        GoBoxClient.getAuth().isLogged().then(function(logged) {

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

            // If the client state doesn't matter, go to the next state
            if (toState.data.access.clientReady == StateRule.CAN) {
                return;
            }

            // If the client is not ready, but the next state wants it
            if (!GoBoxClient.isReady() && toState.data.access.clientReady == StateRule.MUST) {

                // Go to the loading state
                event.preventDefault();
                $state.go('loading');

                // And try to connect
                GoBoxClient.init().then(function() {

                    // Connected! go to the home
                    $state.go('home.files');
                }, function() {

                    // Not ready... retry soon
                    $timeout(function() {
                        $state.go('home.files');
                    }, 5000);
                });
                return;
            }

            // If the client is ready but the state doesn't want it
            if (GoBoxClient.isReady() && toState.data.access.clientReady == StateRule.MUST_NOT) {

                // Redirect to the home
                event.preventDefault();
                $state.go('home.files');
                return;
            }
        });

    });
})

.config(function($mdThemingProvider) {
    // Theme configuration
    $mdThemingProvider.theme('default')
        .primaryPalette('light-blue')
        .accentPalette('deep-orange');
});