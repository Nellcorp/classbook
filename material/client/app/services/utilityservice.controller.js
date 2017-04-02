(function() {
    'use strict';
    var api = 'https://classbook.co:3002';
    angular.module('app.service')
        .factory("UtilityService", ["$resource",
            function($resource) {
                var utility = {};
                String.prototype.ucfirst = function() {
                    return this.charAt(0).toUpperCase() + this.substr(1);
                };
                //utility.ucfirst = function (string) { return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase(); };

                return utility;
            }
        ]);
})();