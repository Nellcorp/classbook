(function() {
    'use strict';

    angular.module('app.import')
        .controller('importCtrl', ['$scope', '$rootScope', '$cookies', 'Upload', '$q', '$location', 'randomString', 'UserService', 'AuthService', 'SchoolService', 'CourseService', 'GroupService', 'SubjectService', 'ScheduleService', 'SessionService', 'AbsenceService', 'ErrorService', 'StorageService', 'ImportService', 'ExportService', 'ValidationService', '$stateParams', importCtrl]);

    function importCtrl($scope, $rootScope, $cookies, Upload, $q, $location, randomString, UserService, AuthService, SchoolService, CourseService, GroupService, SubjectService, ScheduleService, SessionService, AbsenceService, ErrorService, StorageService, ImportService, ExportService, ValidationService, $stateParams) {

        if($rootScope.hasOwnProperty('user') && typeof $rootScope.user !== 'undefined'){
                $scope.user = $rootScope.user;
            }else{
                $scope.user = $cookies.getObject('user');
            }
        
        $scope.id = $scope.user.school;

        if (!$scope.id) {
            $scope.message = "Escola inválida.";
            $location.url('/page/profile/' + $scope.user.type);
        }

        var XLX = XLSX;

        $scope.message = ''; //error messages
        $scope.button = 'Importar';
        $scope.form_error = false;
        $scope.show_log = false;
        $scope.log = [];
        $scope.valid = false;
        $scope.ready = false;
        $scope.file = '';
        $scope.blob = '';

        //Data pulled from server
        $scope.users_id = {};
        $scope.courses_id = {};
        $scope.subjects_id = {};
        $scope.existing_users = {};
        $scope.existing_emails = {};
        $scope.existing_groups = {};
        $scope.existing_courses = {};
        $scope.existing_subjects = {};
        $scope.existing_schedules = {};

        //Validated data ready for import
        $scope.courses = {};
        $scope.groups = {};
        $scope.subjects = {};
        $scope.professors = {};
        $scope.students = {};
        $scope.turma = [];
        $scope.schedules = {};

        ExportService.get({}, function(result) {
            $scope.data = result;
            var i;
            var courses = result.courses,
                subjects = result.subjects,
                groups = result.groups,
                users = result.users,
                schedules = result.schedules;
            $scope.school = result.school;


            for (i = 0; i < courses.length; i++) {
                $scope.existing_courses[courses[i].name] = courses[i];
                $scope.courses_id[courses[i]._id] = courses[i];
            }

            for (i = 0; i < groups.length; i++) {
                $scope.existing_groups[groups[i].name] = groups[i];
            }

            for (i = 0; i < subjects.length; i++) {
                $scope.existing_subjects[$scope.courses_id[subjects[i].course].name + '_' + subjects[i].name] = subjects[i];
                $scope.subjects_id[subjects[i]._id] = subjects[i];
            }

            for (i = 0; i < users.length; i++) {
                $scope.existing_users[users[i].phone] = users[i];
                $scope.existing_emails[users[i].email] = users[i];
                $scope.users_id[users[i]._id] = users[i];
            }

            for (i = 0; i < schedules.length; i++) {
                $scope.existing_schedules[$scope.courses_id[schedules[i].course].name + '_' + $scope.subjects_id[schedules[i].subject].name + '_' + $scope.users_id[schedules[i].professor].phone] = schedules[i];
            }

            $scope.ready = true;
        }, function(error) {
            $location.url('/page/profile/' + StorageService.me().type);
        });

        $scope.process = function(data) {
            var workbook = XLS.read(data, {
                type: 'base64'
            });
            var output = $scope.to_json(workbook);
            return output;
        };

        $scope.to_json = function(workbook) {
            var result = {};
            workbook.SheetNames.forEach(function(sheetName) {
                var roa = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                if (roa.length > 0) {
                    var temp = JSON.parse(JSON.stringify(roa).toLowerCase());
                    result[sheetName] = temp;
                }
            });
            return result;
        };

        $scope.submitForm = function() {

            if ($scope.valid) {
                $scope.button = 'A Importar: por favor aguarde.';

                var imported = ImportService.save($scope.payload, function(response) {
                    //console.log('success log', response);
                    $location.url('/page/profile/' + StorageService.me().type);
                }, function(error) {
                    //console.log('error log', error);
                    $scope.form_error = true;
                    //$scope.message = error.data.result;
                    $scope.message = 'A importação falhou. Por favor tente novamente.';
                    $scope.button = "Importar";
                });
            }
        };

        $scope.canSubmit = function(file, errFiles) {

            if (!$scope.ready) {
                return false;
            }

            $scope.errFile = errFiles && errFiles[0];

            if (!file) {
                return false;
            }

            $scope.file = file;
            Upload.base64DataUrl(file).then(function(url) {
                $scope.blob = url.split(',');

                if ($scope.blob.length != 2) {
                    $scope.form_error = true;
                    $scope.message = 'Houve um problema ao processar o ficheiro.';
                    return false;
                }

                $scope.blob = $scope.blob[1];

                var formats = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xls', 'xlsx'];

                if (typeof file == 'undefined' || !('type' in file)) {
                    $scope.form_error = true;
                    $scope.message = 'Ficheiro corrompido.';
                    return false;
                }

                var type = file.type;

                if (type !== '' && formats.indexOf(file.type) == -1) {
                    $scope.message = 'Formato de ficheiro não suportado. Use apenas .XLS ou .XLSX';
                    $scope.form_error = true;
                    return false;
                }

                //Start IE workaround
                if (type === '') {
                    type = file.name.split('.');
                    if (type.length != 2) {
                        $scope.message = 'Formato de ficheiro não suportado. Use apenas .XLS ou .XLSX';
                        $scope.form_error = true;
                        return false;
                    }

                    if (formats.indexOf(type[1].toLowerCase()) == -1) {
                        $scope.message = 'Formato de ficheiro não suportado. Use apenas .XLS ou .XLSX';
                        $scope.form_error = true;
                        return false;
                    }

                }
                //End IE workaround
                //console.dir(type);


                //console.log('Encoded Data', $scope.blob);

                try {
                    $scope.data = $scope.process($scope.blob);
                } catch (err) {
                    $scope.form_error = true;
                    $scope.message = 'Formato de ficheiro não suportado.';
                }

                //console.log('JSON Data', $scope.data);

                var keys = ['cursos', 'turmas', 'disciplinas', 'professores', 'horarios', 'estudantes'];
                var fields = Object.keys($scope.data);

                for (var i = 0; i < keys.length; i++) {
                    //console.log('Validating ',keys[i]);
                    if (fields.indexOf(keys[i]) == -1 || $scope.data[keys[i]].length === 0) {
                        $scope.message = 'O documento precisa de folhas com os nomes cursos, turmas, disciplinas, professores, horarios e estudantes';
                        $scope.form_error = true;
                        return false;
                    }
                    //console.log('Validated ',keys[i]);
                }

                $scope.courses = ValidationService.courses($scope.data.cursos, $scope.existing_courses, $scope.school);
                $scope.groups = ValidationService.groups($scope.data.turmas, $scope.existing_groups, $scope.school);
                $scope.professors = ValidationService.professors($scope.data.professores, $scope.existing_users, $scope.school);
                $scope.subjects = ValidationService.subjects($scope.data.disciplinas, $scope.existing_subjects, $scope.school, $scope.courses.passed, $scope.existing_courses);
                $scope.students = ValidationService.students($scope.data.estudantes, $scope.existing_users, $scope.school, $scope.courses.passed, $scope.existing_courses, $scope.groups.passed, $scope.existing_groups);
                $scope.schedules = ValidationService.schedules($scope.data.horarios, $scope.existing_schedules, $scope.school, $scope.courses.passed, $scope.existing_courses, $scope.subjects.passed, $scope.existing_subjects, $scope.professors.passed, $scope.existing_users, $scope.groups.passed, $scope.existing_groups);

                var components = ['courses', 'groups', 'subjects', 'professors', 'schedules', 'students'];

                for (i = 0; i < components.length; i++) {
                    if (!$scope[components[i]].status) {
                        $scope.show_log = true;
                        for (var j = 0; j < $scope[components[i]].messages.length; j++) {
                            var len = $scope.log.length + 1;
                            $scope.log.push(len + ': ' + $scope[components[i]].messages[j]);
                        }
                    }
                }

                if ($scope.courses.data.length === 0 && $scope.subjects.data.length === 0 && $scope.groups.data.length === 0 && $scope.professors.data.length === 0 && $scope.students.data.length === 0 && $scope.schedules.data.length === 0) {
                    $scope.form_error = true;
                    $scope.message = 'Houve erros ao validar o documento. Por favor verifique toda a informação abaixo.';
                    return false;
                }

                if ($scope.show_log) {
                    $scope.message = 'Houve erros ao validar o documento, mas poderá ainda submeté-lo. Por favor verifique a informação abaixo.';
                }

                var body = {
                    courses: $scope.courses.data,
                    groups: $scope.groups.data,
                    professors: $scope.professors.data,
                    subjects: $scope.subjects.data,
                    students: $scope.students.data,
                    schedules: $scope.schedules.data
                };

                //console.log(body);

                //var compressed = pako.gzip(JSON.stringify(body));
                //console.log(compressed);

                $scope.payload = {
                    school: $scope.school._id,
                    data: body
                };

                //console.log(JSON.stringify($scope.payload));

                $scope.valid = true;
            });

        };
    }
})();