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
            logged: false
        })
        .state('home', {
            url: '/',
            templateUrl: 'views/filelist.html',
            controller: 'FileListCtrl',
            logged: true
        });
        
        $urlRouterProvider.otherwise("/login");

})

.run(function($rootScope, GoBoxClient, $state) {
    
    $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
        
        console.log("Event", event);
        console.log("toState", toState);
        console.log("toStateParams", toStateParams);
        console.log("Logged", GoBoxClient.isLogged());
        
        if (toState.logged == GoBoxClient.isLogged())
            return ;
        event.preventDefault();
        if(GoBoxClient.isLogged())
            $state.go('home', toStateParams);
        else
            $state.go('login');
    });
});