(function() {
    'use strict';
    var api = 'http://classbook.co:3002';
    angular.module('app.service')
        .factory("ErrorService", ["$resource",
            function($resource) {
                var error = {};
                error.parse = function(err) {
                    var message = 'Houve um erro no seu pedido.';

                    if (error.status == 500) {

                        if (error.data.hasOwnProperty('name') && error.data.name == 'ValidationError') {

                            var index = Object.getOwnPropertyNames(error.data.errors)[0];
                            message = error.data.errors[index].message;

                        } else if (error.data.hasOwnProperty('message')) {
                            message = error.data.message;
                        } else {
                            message = error.data.statusText;
                        }
                    }

                    if (error.status == 403) {
                        return "Não está autorizado a realizar esta operação";
                    }

                    if (error.status == 401) {
                        return "Não está autenticado. Por favor, faça o login";
                    }

                    if (error.status == 200) {
                        return "Sucesso";
                    }

                };
                return error;

            }
        ]);
})();