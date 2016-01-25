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
    'ngSanitize',
    'ui.router',
    'ngMaterial',
    'ngMessages'
])

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            data: {
                logged: false
            }
        })
        .state('home', {
            url: '/',
            templateUrl: 'views/filelist.html',
            controller: 'FileListCtrl',
            data: {
                logged: true
            }
        });
        
        $urlRouterProvider.otherwise("/login");

})

.run(function($rootScope, GoBoxClient, $state) {
    
    $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
        if (toState.data.logged == GoBoxClient.isLogged())
            return ;
        if(GoBoxClient.isLogged())
            $state.go('home');
        else
            $state.go('login');
    });
});