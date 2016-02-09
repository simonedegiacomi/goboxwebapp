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
        'ngFileUpload'
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
        views: {
            'main': {
                templateUrl: 'views/home.files.html',
                controller: 'FileListCtrl'
            }
        }
    })

    // This state show the files. In the sidenav you'll see the pwd. When the user
    // will click the search button the state 'search' is activated.
    .state('home.filter', {
        url: '/search/:kind/:keyword',
        restricted: true,
        views: {
            'main': {
                templateUrl: 'views/home.filter.html',
                controller: 'FilterCtrl'
            }
        }
    })

    // This state is an alternative to 'home.files'
    .state('home.settings', {
        url: '/settings',
        restricted: true,
        views: {
            'main': {
                templateUrl: 'views/home.settings.html',
                controller: 'SettingsCtrl'
            }
        }
    })

    // This show the error message relative to the conneciton. Not sure
    // if this is a view...
    .state('home.error', {
        url: '/error',
        restricted: true,
        views: {
            'main': {
                templateUrl: 'views/home.error.html',
                reload: true,
                controller: 'ErrorCtrl'
            }
        }
    })

    $urlRouterProvider.otherwise("/login");

})

.run(function($rootScope, GoBoxClient, $state) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
        
        if (toState.restricted == GoBoxClient.isLogged())
            return;
        event.preventDefault();
        if (GoBoxClient.isLogged())
            $state.go('home.files', toStateParams);
        else
            $state.go('login');
    });
});