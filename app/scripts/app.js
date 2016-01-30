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
            url: '/',
            templateUrl: 'views/filelist.html',
            controller: 'FileListCtrl',
            restricted: true
        })
        .state('settings', {
            url: '/settings',
            templateUrl: 'views/settings.html',
            controller: 'SettingsCtrl',
            restricted: true
        });
        $urlRouterProvider.otherwise("/login");

})

.run(function($rootScope, GoBoxClient, $state) {
    
    $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
        if (toState.restricted == GoBoxClient.isLogged())
            return ;
        event.preventDefault();
        if(GoBoxClient.isLogged())
            $state.go('home', toStateParams);
        else
            $state.go('login');
    });
});