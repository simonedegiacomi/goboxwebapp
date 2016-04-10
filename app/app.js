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

    /**
     * Route config
     */
    $stateProvider
    // This state is active only when the user is not logged
        .state('login', {
        url: '/login',
        templateUrl: 'states/login/login.html',
        controller: 'LoginCtrl',
        access: {
            restricted: false,
            connected: false,
        }
    })

    // State for the preview of a shared file
    .state('public_file', {
        url: '/public_file/:hostName/:id',
        templateUrl: 'states/publicfile/publicfile.html',
        controller: 'PublicFileCtrl'
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
        access: {
            restricted: true,
            connected: false,
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
        access: {
            restricted: true,
            connected: true,
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
        },
        access: {
            restricted: true,
            connected: true,
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
        },
        access: {
            restricted: true,
            connected: true,
        }
    })

    // All this states are now simple filters. The folter in this case sow the files
    // in a grid view. all the preview are dialogs, except for the music that will use
    // a some background manager that insert a toolbar a the bottom of the page
    // .state('home.images', {
    //     url: '/images',
    //     views: {
    //         'main@home': {
    //             templateUrl: 'views/home.images.html',
    //             controller: 'ImagesCtrl'
    //         }
    //     },
    //     access: {
    //         restricted: true,
    //         connected: true,
    //     }
    // })

    // .state('home.videos', {
    //     url: '/videos',
    //     views: {
    //         'main@home': {
    //             templateUrl: 'views/home.videos.html',
    //             controller: 'VideosCtrl'
    //         }
    //     },
    //     access: {
    //         restricted: true,
    //         connected: true,
    //     }
    // })

    // .state('home.music', {
    //     url: '/music',
    //     views: {
    //         'main@home': {
    //             templateUrl: 'views/home.music.html',
    //             controller: 'MusicCtrl'
    //         }
    //     },
    //     access: {
    //         restricted: true,
    //         connected: true,
    //     }
    // })

    // .state('home.documents', {
    //     url: '/documents',
    //     views: {
    //         'main@home': {
    //             templateUrl: 'views/home.videos.html',
    //             controller: 'DocumentsCtrl'
    //         }
    //     },
    //     access: {
    //         restricted: true,
    //         connected: true,
    //     }
    // })
    
    .state('home.recent', {
        url: '/recent',
        views: {
            'main@home': {
                templateUrl: 'states/home/recent/recent.js',
                controller: 'RecentCtrl'
            }
        },
        access: {
            restricted: true,
            connected: true
        }
    })


    .state('home.trash', {
        url: '/recent',
        views: {
            'main@home': {
                templateUrl: 'states/home/trash/trash.js',
                controller: 'TrashCtrl'
            }
        },
        access: {
            restricted: true,
            connected: true
        }
    })
    
    .state('home.settings', {
        url: '/settings',
        views: {
            'main@home': {
                templateUrl: 'states/home/settings/settings.html',
                controller: 'SettingsCtrl'
            }
        },
        access: {
            restricted: true,
            connected: false,
        }
    })

    // This show the error message relative to the conneciton. Not sure
    // if this is a view...
    .state('home.error', {
        url: '/error',
        views: {
            'main@home': {
                templateUrl: 'states/home/error/error.html',
                controller: 'ErrorCtrl'
            }
        },
        access: {
            restricted: true,
            connected: false,
            preventLoop: true
        }
    })

    .state('home.loading', {
        url: '/loading',
        views: {
            'main@home': {
                templateUrl: 'states/home/loading/loading.html',
                controller: 'LoadingCtrl'
            }
        },
        access: {
            restricted: true,
            connected: false,
            preventLoop: true
        }
    });

    $urlRouterProvider.otherwise("/login");
})

.run(function($rootScope, GoBoxClient, $state, $timeout) {

    // This object contains the last state params before the state has changed
    // not by the user
    var lastToState = {};

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
            case 'noStorage':
                retryConnect();
                break;
            case 'error':
                // If the initialization has failed, show the error
                $state.go('home.error');
                break;
        }
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
        // TODO: clean this unredable code!
        var access = toState.access;
        
        if(!angular.isDefined(access)) {
            return;
        }
        
        // Check if the user is authorized to access the next state
        if (access.restricted == GoBoxClient.isLogged()) {

            // If the next state is an error or loading state, i must not check the
            // GoBoxClient state, otherwise i'll fall in a loop
            if (access.preventLoop) {

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

            if (!access.connected)
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

        GoBoxClient.getAuth().check().then(function(valid) {

            if (!valid) {
                // Redirect to the login
                $state.go('login');
                return;
            }

            // And redirect to the home
            $state.go(toState, toStateParams, {
                reload: true
            });

        }, function(response) {
            $state.go('login');
        });

    });

    function retryConnect() {
        $timeout(function() {
            GoBoxClient.init();
        }, 5000);
    }
});