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
        'ngCookies',
        'ui.router',
        'ngMaterial',
        'ngMessages',
        'ngFileUpload',
        'vcRecaptcha',
        'com.2fdevs.videogular',
        'com.2fdevs.videogular.plugins.controls',
        'com.2fdevs.videogular.plugins.overlayplay',
        'com.2fdevs.videogular.plugins.buffering'
    ])

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
    // This state is active only when the user is not logged
        .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        restricted: false
    })

    // This is the main state. When the user is logged this state is alway on.
    // This contains the sidenav
    .state('home', {
        abstract: true,
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        restricted: true
    })

    // This state is active when the user wants see his file. This
    // state live in the 'home' state.
    // This contains the sidenav with the search button
    .state('home.files', {
        url: '/files/:id',
        restricted: true,
        templateUrl: 'views/home.files.html',
        controller: 'FileListCtrl'
    })

    .state('home.share', {
        url: '/share',
        restricted: true,
        templateUrl: 'views/home.share.html',
        controller: 'ShareCtrl'
    })

    // This state show the files. In the sidenav you'll see the pwd. When the user
    // will click the search button the state 'search' is activated.
    .state('home.filter', {
        url: '/search/:kind/:keyword',
        restricted: true,
        templateUrl: 'views/home.filter.html',
        controller: 'FilterCtrl'
    })

    // This state is an alternative to 'home.files'
    .state('home.settings', {
        url: '/settings',
        restricted: true,
        templateUrl: 'views/home.settings.html',
        controller: 'SettingsCtrl'
    })

    // This show the error message relative to the conneciton. Not sure
    // if this is a view...
    .state('home.error', {
        url: '/error',
        restricted: true,
        templateUrl: 'views/home.error.html',
        controller: 'ErrorCtrl',
        preventLoop: true
    })

    .state('home.loading', {
        url: '/loading',
        restricted: true,
        templateUrl: 'views/home.loading.html',
        controller: 'LoadingCtrl',
        preventLoop: true
    });

    $urlRouterProvider.otherwise("/login");
})

.run(function($rootScope, GoBoxClient, GoBoxAuth, $state) {

    // This object contains the last state params before the state has changed
    // not by the user
    var lastToState = {};

    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {

        // TODO: clean this unredable code!

        // Check if the user is authorized to access the next state
        if (toState.restricted == GoBoxClient.isLogged()) {

            // If the next state is an error or loading state, i must not check the
            // GoBoxClient state, otherwise i'll fall in a loop
            if (toState.preventLoop) {

                // Is at least the GoBoxClient trying to connect? Maybe (s)he
                // typed the loading or error state url
                if (GoBoxClient.getState() == 'notInitialized') {
                    // Init
                    GoBoxClient.init();
                    // And show the loading state
                    $state.go('home.loading');
                }
                return;
            }

            if (toState.name == 'login')
                return;

            // Ok, now i know that the user is logged, check if the GoBoxClient
            // is ready.
            switch (GoBoxClient.getState()) {
                case 'ready':
                    // Let the user go to the state (s)he wants
                    break;
                case 'error':
                case 'noStorage':
                    // Error view
                    event.preventDefault();
                    $state.go('home.error');
                    break;

                default:
                    // No error? not ready? this means that the user needs to wait
                    event.preventDefault();

                    // Wait, let me save the 'toStateParams' before change the state
                    // so i can redirect the user to the state he wants
                    lastToState.state = toState.name;
                    lastToState.params = toStateParams;

                    $state.go('home.loading');
                    break;
            }
            return;
        }

        // If is not authorized to ACCESS (this doesn't mean that is not loggged!)
        // the next state, prevent the next state
        event.preventDefault();
        if (GoBoxClient.isLogged()) {

            // If the user is logged and it was going to the 'login' state,
            // redirect him to the home and show the root folder
            $state.go('home.files', {
                id: 1
            });
            return;
        }

        /**
         * Check if there is an old session in the cookie
         */
        // TODO: Move the logic of this code to a service

        var auth = new GoBoxAuth();

        auth.check().then(function(valid) {

            if (!valid) {
                // Redirect to the login
                $state.go('login');
                return;
            }

            // If is still valid configure the API Client Object
            GoBoxClient.setAuth(auth);

            // And redirect to the home
            $state.go(toState, toStateParams);
        }, function(response) {
            $state.go('login');
        });

    });

    GoBoxClient.onStateChange(function(newState) {
        // when the state change
        switch (newState) {
            case 'ready':
                // If now the GoBoxClient is ready let the user see his files
                if (angular.isDefined(lastToState.state))
                    $state.go(lastToState.state, lastToState.params);
                else
                    $state.go('home.files', {
                        id: 1
                    });
                break;
            case 'error':
                // If the initialization has failed, show the error
                $state.go('home.error');
                break;
        }
    });
});