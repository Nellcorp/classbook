(function() {
    'use strict';
    var api = 'https://classbook.co:3002';
    angular.module('app.service')
        .factory("UserService", ["$resource", "$state",
            function($resource, $state) {
                return $resource(api + "/users/:id", {
                    Id: "@id"
                }, {
                    "update": {
                        method: "PUT"
                    }
                });
            }
        ])
        .factory("SignupService", ["$resource", "$state",
            function($resource, $state) {
                return $resource(api + "/signup/:id", {
                    Id: "@id"
                }, {
                    "update": {
                        method: "PUT"
                    }
                });
            }
        ])
        .factory("ImportService", ["$resource", "$state",
            function($resource, $state) {
                return $resource(api + "/import/:id", {
                    Id: "@id"
                }, {
                    "update": {
                        method: "PUT"
                    }
                });
            }
        ])
        .factory("ExportService", ["$resource", "$state",
            function($resource, $state) {
                return $resource(api + "/export/:id", {
                    Id: "@id"
                }, {
                    "update": {
                        method: "PUT"
                    }
                });
            }
        ])
        .factory("SchoolService", ["$resource",
            function($resource) {
                return $resource(api + "/schools/:id", {
                    Id: "@id"
                }, {
                    "update": {
                        method: "PUT"
                    }
                });
            }
        ])
        .factory("CourseService", ["$resource",
            function($resource) {
                return $resource(api + "/courses/:id", {
                    Id: "@id"
                }, {
                    "update": {
                        method: "PUT"
                    }
                });
            }
        ])
        .factory("GroupService", ["$resource",
            function($resource) {
                return $resource(api + "/groups/:id", {
                    Id: "@id"
                }, {
                    "update": {
                        method: "PUT"
                    }
                });
            }
        ])
        .factory("SubjectService", ["$resource",
            function($resource) {
                return $resource(api + "/subjects/:id", {
                    Id: "@id"
                }, {
                    "update": {
                        method: "PUT"
                    }
                });
            }
        ])
        .factory("ScheduleService", ["$resource",
            function($resource) {
                return $resource(api + "/schedules/:id", {
                    Id: "@id"
                }, {
                    "update": {
                        method: "PUT"
                    }
                });
            }
        ])
        .factory("SessionService", ["$resource",
            function($resource) {
                return $resource(api + "/sessions/:id", {
                    Id: "@id"
                }, {
                    "update": {
                        method: "PUT"
                    }
                });
            }
        ])
        .factory("CourseNameService", ["$resource",
            function($resource) {
                return $resource(api + "/coursenames/:id", {
                    Id: "@id"
                }, {
                    "update": {
                        method: "PUT"
                    }
                });
            }
        ])
        .factory("SubjectNameService", ["$resource",
            function($resource) {
                return $resource(api + "/subjectnames/:id", {
                    Id: "@id"
                }, {
                    "update": {
                        method: "PUT"
                    }
                });
            }
        ])
        .factory("AbsenceService", ["$resource",
            function($resource) {
                return $resource(api + "/absences/:id", {
                    Id: "@id"
                }, {
                    "update": {
                        method: "PUT"
                    }
                });
            }
        ]);
})();