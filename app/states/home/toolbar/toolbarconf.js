'use strict';

angular.module('goboxWebapp')

.value('Toolbar', {

    title: {
        mode: 'title'
    },
    buttons: {
        search: {
            visible: true
        },
        switchView: {
            visible: false,
            icon: 'list'
        }
    }
});