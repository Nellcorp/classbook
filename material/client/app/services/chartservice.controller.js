(function() {
    'use strict';
    var api = 'https://classbook.co:3002';
    angular.module('app.service')
        .factory("ChartService", ["$resource",
            function($resource) {
                var options = {};

                var color = {
                    primary: '#009688',
                    success: '#8BC34A',
                    info: '#00BCD4',
                    infoAlt: '#7E57C2',
                    warning: '#FFCA28',
                    danger: '#F44336',
                    text: '#3D4051',
                    gray: '#EDF0F1'
                };

                options.labelTop = {
                    normal: {
                        color: color.primary,
                        label: {
                            show: true,
                            position: 'center',
                            formatter: '{b}',
                            textStyle: {
                                color: '#999',
                                baseline: 'top',
                                fontSize: 12
                            }
                        },
                        labelLine: {
                            show: false
                        }
                    }
                };

                options.labelFromatter = {
                    normal: {
                        label: {
                            formatter: function(params) {
                                return 100 - params.value + '%'
                            },
                            textStyle: {
                                color: color.text,
                                baseline: 'bottom',
                                fontSize: 20
                            }
                        }
                    },
                };

                options.labelBottom = {
                    normal: {
                        color: '#f1f1f1',
                        label: {
                            show: true,
                            position: 'center'
                        },
                        labelLine: {
                            show: false
                        }
                    }
                };
                options.radius = [55, 60];


                return options;
            }
        ]);
})();