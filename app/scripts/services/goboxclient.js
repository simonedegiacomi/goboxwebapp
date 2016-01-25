'use strict';

/**
 * 
 * Created by Degiacomi Simone on 25/01/2016
 */
angular.module('goboxWebapp')
  .service('GoBoxClient', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
    this.setAuth = function (auth) {
      
    };
    
    this.isLogged = function () {
      return false;
    }
    
  });
