'use strict';

/**
 * @ngdoc overview
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
        'ngMessages'
    ])

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            restricted: false
        })
        .state('home', {
            abstract: true,
            views: {
                '@': {
                    templateUrl: 'views/home.html',
                    controller: 'HomeCtrl'
                }
            }
        })
        .state('filelist', {
            parent: 'home',
            url: '/',
            restricted: true,
            views: {
                'main@home': {
                    templateUrl: 'views/filelist.html',
                    controller: 'FileListCtrl'
                }
            }
        })
        .state('settings', {
            parent: 'home',
            url: '/settings',
            views: {
                'main@home': {
                    templateUrl: 'views/settings.html',
                    controller: 'SettingsCtrl'
                }
            },
            restricted: true
        });
        
    $urlRouterProvider.otherwise("/login");

})

.run(function($rootScope, GoBoxClient, $state) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
        if (toState.restricted == GoBoxClient.isLogged())
            return;
        event.preventDefault();
        if (GoBoxClient.isLogged())
            $state.go('filelist', toStateParams);
        else
            $state.go('login');
    });
});