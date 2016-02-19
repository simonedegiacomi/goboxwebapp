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
        'vcRecaptcha'
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
    // This contains the sidenav woth the search button
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
        controller: 'ErrorCtrl'
    });

    $urlRouterProvider.otherwise("/login");
})

.run(function($rootScope, GoBoxClient, GoBoxAuth, $state) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {

        // Check if the user is authorized to access the next state
        if (toState.restricted == GoBoxClient.isLogged())
            return;
        // If is not authorized, prevent the next state
        event.preventDefault();
        if (GoBoxClient.isLogged()) {
            console.log("Redirect because the user is logger");
            // If the user is logged and it was going to the 'login' router,
            // redirect him to the home and show the root folder
            $state.go('home.files', {
                id: 1
            });
            return;
        }

        /**
         * Check if there is an old session in the cookie
         */
        // TODO: Move this code to a service

        // Load an hypotetical old session
        var auth = GoBoxAuth.loadFromCookie();
        // If there is an old session...
        if (auth.hasToken()) {

            // Check if is still valid
            auth.check().then(function(valid) {

                if (!valid) {
                    console.log("Redirect to login because the user is not logger");
                    // Redirect to the login
                    $state.go('login');
                    return;
                }

                // If is still valid configure the API Client
                GoBoxClient.setAuth(auth);

                // And redirect to the home
                $state.go(toState, toStateParams);
            });

        }
    });
});