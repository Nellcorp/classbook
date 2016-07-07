(function () {
    'use strict';

    angular.module('app.delete')
/*DONE*/.controller('removeUserCtrl', ['$scope','$location','$cookies','$q','UserService','SchoolService','CourseService','SubjectService','ScheduleService','SessionService','StorageService','$stateParams',removeUserCtrl])
/*DONE*/.controller('removeSchoolCtrl', ['$scope','$location','$cookies','SchoolService','UserService','StorageService','$stateParams',removeSchoolCtrl])
/*DONE*/.controller('removeSchoolProfCtrl', ['$scope','$location','$cookies','$q','UserService','SchoolService','CourseService','SubjectService','ScheduleService','SessionService','StorageService','$stateParams',removeSchoolProfCtrl])
/*DONE*/.controller('removeSchoolStudentCtrl', ['$scope','$location','$cookies','$q','UserService','SchoolService','CourseService','SubjectService','ScheduleService','SessionService','StorageService','$stateParams',removeSchoolStudentCtrl])
        .controller('removeSchoolSubjectCtrl', ['$scope','$location','$cookies','$q','UserService','SchoolService','CourseService','SubjectService','ScheduleService','SessionService','StorageService','$stateParams',removeSchoolSubjectCtrl])
        .controller('removeSchoolCourseCtrl', ['$scope','$location','$cookies','$q','UserService','SchoolService','CourseService','SubjectService','ScheduleService','SessionService','StorageService','$stateParams',removeSchoolCourseCtrl])
        .controller('removeSchoolScheduleCtrl', ['$scope','$location','$cookies','$q','UserService','SchoolService','CourseService','SubjectService','ScheduleService','SessionService','StorageService','$stateParams',removeSchoolScheduleCtrl])
        .controller('removeCourseCtrl', ['$scope','$location','$cookies','$q','UserService','SchoolService','CourseService','SubjectService','ScheduleService','SessionService','StorageService','$stateParams',removeCourseCtrl])
/*DONE*/.controller('removeCourseStudentCtrl', ['$scope','$location','$cookies','$q','UserService','SchoolService','CourseService','SubjectService','ScheduleService','SessionService','StorageService','$stateParams',removeCourseStudentCtrl])
        .controller('removeCourseSubjectCtrl', ['$scope','$location','$cookies','$q','UserService','SchoolService','CourseService','SubjectService','ScheduleService','SessionService','StorageService','$stateParams',removeCourseSubjectCtrl])        
        .controller('removeSubjectCtrl', ['$scope','$location','$cookies','$q','UserService','SchoolService','CourseService','SubjectService','ScheduleService','SessionService','StorageService','$stateParams',removeSubjectCtrl])
        .controller('removeSubjectScheduleCtrl', ['$scope','$location','$cookies','$q','UserService','SchoolService','CourseService','SubjectService','ScheduleService','SessionService','StorageService','$stateParams',removeSubjectScheduleCtrl])
        .controller('removeProfessorScheduleCtrl', ['$scope','$location','$cookies','$q','UserService','SchoolService','CourseService','SubjectService','ScheduleService','SessionService','StorageService','$stateParams',removeProfessorScheduleCtrl])
        .controller('removeScheduleCtrl', ['$scope','$location','$cookies','$q','UserService','SchoolService','CourseService','SubjectService','ScheduleService','SessionService','StorageService','$stateParams',removeScheduleCtrl]);
        
        
function removeSchoolSubjectCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        $scope.button = 'ELIMINAR TODAS AS DISCIPLINAS DA ESCOLA';
        $scope.message = '';

        SchoolService.get({id: $scope.id},
            function(response) {
            $scope.school = response;
            SubjectService.query({school: $scope.school._id},
                function(response) {
                    $scope.subjects = response;
        $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.id)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if($scope.subjects.length == 0){
                $scope.form_error = true;
                $scope.message = 'Não existem disciplinas nesta escola';
                return false;
            }

            if(!$scope.school || !$scope.userForm){ $scope.form_error = true; $scope.message = 'Escola Inválida'; return false; }

            return true;
        };

        $scope.delete = function() {

            var chain = $q.when();
            chain = chain.then(function(){
                for(var i = 0; i < $scope.subjects.length; i++){
                    SubjectService.delete({id: $scope.subjects[i]._id},function(response){},function(error){  $scope.form_error = true; $scope.message = error.message; });}
            });
            chain.then(function(){
               $location.url('/page/school/subjects/'+$scope.id);
            });
        };
                },function(error) {
                    $location.url('/page/profile/'+$cookies.getObject('user').type);
                });
            },
            function(error) {
                $location.url('/page/profile/'+$cookies.getObject('user').type);
            });

}

function removeSchoolCourseCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {        $scope.id = $stateParams.id;
        $scope.form_error = false;
        
        $scope.button = 'ELIMINAR TODOS OS CURSOS DA ESCOLA';
        $scope.message = '';

        SchoolService.get({id: $scope.id},
            function(response) {
            $scope.school = response;
            CourseService.query({school: $scope.school._id},
                function(response) {
                    $scope.courses = response;
        
        $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.id)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if($scope.courses.length == 0){
                $scope.form_error = true;
                $scope.message = 'Não existem cursos nesta escola';
                return false;
            }

            if(!$scope.school || !$scope.userForm){ $scope.form_error = true; $scope.message = 'Escola Inválida'; return false; }

            return true;
        };

        $scope.delete = function() {

            var chain = $q.when();
            chain = chain.then(function(){
                for(var i = 0; i < $scope.courses.length; i++){
                    CourseService.delete({id: $scope.courses[i]._id},function(response){},function(error){  $scope.form_error = true; $scope.message = error.message; });}
            });
            chain.then(function(){
               $location.url('/page/school/courses/'+$scope.id);
            });
        };                    
                },function(error) {
                    $location.url('/page/profile/'+$cookies.getObject('user').type);
                });
            },
            function(error) {
                $location.url('/page/profile/'+$cookies.getObject('user').type);
            });

}

function removeSchoolScheduleCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        $scope.button = 'ELIMINAR TODOS OS HORÁRIOS DA ESCOLA';
        $scope.message = '';

        SchoolService.get({id: $scope.id},
            function(response) {
            $scope.school = response;
            ScheduleService.query({school: $scope.school._id},
                function(response) {
                    $scope.schedules = response;
        $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.id)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if($scope.schedules.length == 0){
                $scope.form_error = true;
                $scope.message = 'Não existem professores nesta escola';
                return false;
            }

            if(!$scope.school || !$scope.userForm){ $scope.form_error = true; $scope.message = 'Escola Inválida'; return false; }

            return true;
        };

        $scope.delete = function() {

            var chain = $q.when();
            chain = chain.then(function(){
                for(var i = 0; i < $scope.schedules.length; i++){
                    ScheduleService.delete({id: $scope.schedules[i]._id},function(response){},function(error){  $scope.form_error = true; $scope.message = error.message; });}
            });
            chain.then(function(){
               $location.url('/page/school/schedules/'+$scope.id);
            });
        };                    
                },function(error) {
                    $location.url('/page/profile/'+$cookies.getObject('user').type);
                });
            },
            function(error) {
                $location.url('/page/profile/'+$cookies.getObject('user').type);
            });
}

function removeCourseSubjectCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        $scope.button = 'ELIMINAR TODAS AS DISCIPLINAS DO CURSO';
        $scope.message = '';

        CourseService.get({id: $scope.id},
            function(response) {
            $scope.course = response;
            SchoolService.get({id: $scope.course.school},
                function(response) {
                    $scope.school = response;
                    SubjectService.query({school: $scope.school._id, course: $scope.course._id},
                        function(response) {
                            $scope.subjects = response;
        $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.school._id)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if($scope.subjects.length == 0){
                $scope.form_error = true;
                $scope.message = 'Não existem disciplinas neste curso';
                return false;
            }

            if(!$scope.course || !$scope.userForm){ $scope.form_error = true; $scope.message = 'Curso Inválido'; return false; }

            if(!$scope.school || !$scope.userForm){ $scope.form_error = true; $scope.message = 'Escola Inválida'; return false; }

            return true;
        };

        $scope.delete = function() {

            var chain = $q.when();
            chain = chain.then(function(){
                for(var i = 0; i < $scope.subjects.length; i++){
                    SubjectService.delete({id: $scope.subjects[i]._id},function(response){},function(error){  $scope.form_error = true; $scope.message = error.message; });}
            });
            chain.then(function(){
               $location.url('/page/course/subjects/'+$scope.id);
            });
        };   
                        },function(error) {
                            $location.url('/page/profile/'+$cookies.getObject('user').type);
                        });
                },function(error) {
                    $location.url('/page/profile/'+$cookies.getObject('user').type);
                });
            },
            function(error) {
                $location.url('/page/profile/'+$cookies.getObject('user').type);
            });
}
function removeSubjectScheduleCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        $scope.button = 'ELIMINAR HORÁRIOS DA DISCIPLINA';
        $scope.message = '';

        SubjectService.get({id: $scope.id},
            function(response) {
            $scope.subject = response;
            SchoolService.get({id: $scope.subject.school},
                function(response) {
                    $scope.school = response;
                    ScheduleService.query({school: $scope.school._id, subject: $scope.subject._id},
                        function(response) {
                            $scope.schedules = response;
                                    $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.school._id)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if($scope.schedules.length == 0){
                $scope.form_error = true;
                $scope.message = 'Não existem horários para esta disciplina';
                return false;
            }

            if(!$scope.subject || !$scope.userForm){ $scope.form_error = true; $scope.message = 'Disciplina Inválida'; return false; }

            if(!$scope.school || !$scope.userForm){ $scope.form_error = true; $scope.message = 'Escola Inválida'; return false; }

            return true;
        };

        $scope.delete = function() {

            var chain = $q.when();
            chain = chain.then(function(){
                for(var i = 0; i < $scope.schedules.length; i++){
                    ScheduleService.delete({id: $scope.schedules[i]._id},function(response){},function(error){  $scope.form_error = true; $scope.message = error.message; });}
            });
            chain.then(function(){
               $location.url('/page/subject/schedules/'+$scope.id);
            });
        };
                        },function(error) {
                            $location.url('/page/profile/'+$cookies.getObject('user').type);
                        });
                },function(error) {
                    $location.url('/page/profile/'+$cookies.getObject('user').type);
                });
            },
            function(error) {
                $location.url('/page/profile/'+$cookies.getObject('user').type);
            });

}
function removeProfessorScheduleCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        $scope.button = 'ELIMINAR HORÁRIOS DO PROFESSOR';
        $scope.message = '';

        UserService.get({id: $scope.id},
            function(response) {
            $scope.professor = response;
            SchoolService.get({id: $scope.professor.school},
                function(response) {
                    $scope.school = response;
                    ScheduleService.query({school: $scope.school._id, professor: $scope.professor._id},
                        function(response) {
                            $scope.schedules = response;
                                    $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.school._id)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if($scope.schedules.length == 0){
                $scope.form_error = true;
                $scope.message = 'Não existem horários para este professor';
                return false;
            }

            if(!$scope.school || !$scope.userForm){ $scope.form_error = true; $scope.message = 'Escola Inválida'; return false; }

            return true;
        };

        $scope.delete = function() {

            var chain = $q.when();
            chain = chain.then(function(){
                for(var i = 0; i < $scope.schedules.length; i++){
                    ScheduleService.delete({id: $scope.schedules[i]._id},function(response){},function(error){  $scope.form_error = true; $scope.message = error.message; });}
            });
            chain.then(function(){
               $location.url('/page/professor/schedules/'+$scope.id);
            });
        };   
                        },function(error) {
                            $location.url('/page/profile/'+$cookies.getObject('user').type);
                        });
                },function(error) {
                    $location.url('/page/profile/'+$cookies.getObject('user').type);
                });
            },
            function(error) {
                $location.url('/page/profile/'+$cookies.getObject('user').type);
            });

}

    
    function removeUserCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        //Cannot delete if user
        //is admin
        //is professor assigned to schedule
        //is manager (must delete school)

        $scope.id = $stateParams.id;
        $scope.form_error = false;
        $scope.message = '';
        $scope.button = 'ELIMINAR UTILIZADOR';
        
        UserService.get({id: $scope.id},
                function(response) {
                    $scope.user = response;
        $scope.button = 'ELIMINAR '+$scope.user.firstname+' '+$scope.user.lastname;
        
        $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.user.school)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            //console.log($scope.userForm);
            $scope.form_error = false;
            console.log($scope.user);

            if(!$scope.user || !$scope.userForm){ $scope.form_error = true; $scope.message = 'Utilizador Inválido'; return false; }
            if($scope.id == $cookies.getObject('user').id){ $scope.form_error = true; $scope.message = 'Contacte um adminitrador para eliminar a sua conta.'; return false; }
            if($scope.user.type == 'admin'){ $scope.form_error = true; $scope.message = 'Apenas o administrador principal pode eliminar este utilizador.'; return false; }
            if($scope.user.type == 'manager'){ $scope.button = 'Esta acção irá eliminar toda a escola'; return true; }
            if($scope.user.type == 'professor'){
                $scope.button = 'Eliminar professor e todos os seus horários';
                return true;
            }

            return !$scope.form_error;
        };                   

        $scope.delete = function() {

            UserService.delete({id: $scope.user._id},function(response){
                //$location.url('/page/profile/'+$cookies.getObject('user').id);
                $location.url('/page/profile/'+$cookies.getObject('user').type);
            },function(error){ 
                $scope.form_error = true;
                $scope.message = error.message;
            });

        };           
                },function(error) {
                    $location.url('/page/profile/'+$cookies.getObject('user').type);
        });
        
    }

    function removeSchoolProfCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        //Must warn user
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        $scope.button = 'ELIMINAR TODOS OS PROFESSORES E HORÁRIOS DA ESCOLA';
        $scope.message = '';

        SchoolService.get({id: $scope.id},
            function(response) {
            $scope.school = response;
            UserService.query({school: $scope.school._id, type: 'professor'},
                function(response) {
                    $scope.professors = response;
            $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.id)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if($scope.professors.length == 0){
                $scope.form_error = true;
                $scope.message = 'Não existem professores nesta escola';
                return false;
            }

            if(!$scope.school || !$scope.userForm){ $scope.form_error = true; $scope.message = 'Escola Inválida'; return false; }

            return true;
        };

        $scope.delete = function() {

            var chain = $q.when();
            chain = chain.then(function(){
                for(var i = 0; i < $scope.professors.length; i++){
                    UserService.delete({id: $scope.professors[i]._id},function(response){},function(error){  $scope.form_error = true; $scope.message = error.message; });}
            });
            chain.then(function(){
               $location.url('/page/school/professors/'+$scope.id);
            });
        };                    
                },function(error) {
                    $location.url('/page/profile/'+$cookies.getObject('user').type);
                });
            },
            function(error) {
                $location.url('/page/profile/'+$cookies.getObject('user').type);
            });
    }

    function removeSchoolStudentCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        $scope.button = 'ELIMINAR TODOS OS ESTUDANTES DA ESCOLA';
        $scope.message = '';

        SchoolService.get({id: $scope.id},
            function(response) {
            $scope.school = response;
            UserService.query({school: $scope.school._id, type: 'student'},
                function(response) {
                    $scope.students = response;
        $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.id)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if($scope.students.length == 0){
                $scope.form_error = true;
                $scope.message = 'Não existem estudantes nesta escola';
                return false;
            }

            if(!$scope.school || !$scope.userForm){ $scope.form_error = true; $scope.message = 'Escola Inválida'; return false; }

            return true;
        };

        $scope.delete = function() {

            var chain = $q.when();
            chain = chain.then(function(){
                for(var i = 0; i < $scope.students.length; i++){
                    UserService.delete({id: $scope.students[i]._id},function(response){},function(error){  $scope.form_error = true; $scope.message = error.message; });}
            });
            chain.then(function(){
               $location.url('/page/school/students/'+$scope.id);
            });
        };                    
                },function(error) {
                    $location.url('/page/profile/'+$cookies.getObject('user').type);
                });
            },
            function(error) {
                $location.url('/page/profile/'+$cookies.getObject('user').type);
            });

    }

    function removeCourseStudentCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        $scope.button = 'ELIMINAR TODOS OS ESTUDANTES DO CURSO';
        $scope.message = '';

        CourseService.get({id: $scope.id},
            function(response) {
            $scope.course = response;
            SchoolService.get({id: $scope.course.school},
                function(response) {
                    $scope.school = response;
                    UserService.query({school: $scope.school._id, course: $scope.course._id, type: 'student'},
                        function(response) {
                            $scope.students = response;
        $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.school._id)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if($scope.students.length == 0){
                $scope.form_error = true;
                $scope.message = 'Não existem estudantes neste curso';
                return false;
            }

            if(!$scope.course || !$scope.userForm){ $scope.form_error = true; $scope.message = 'Curso Inválido'; return false; }

            if(!$scope.school || !$scope.userForm){ $scope.form_error = true; $scope.message = 'Escola Inválida'; return false; }

            return true;
        };

        $scope.delete = function() {

            var chain = $q.when();
            chain = chain.then(function(){
                for(var i = 0; i < $scope.students.length; i++){
                    UserService.delete({id: $scope.students[i]._id},function(response){},function(error){  $scope.form_error = true; $scope.message = error.message; });}
            });
            chain.then(function(){
               $location.url('/page/course/students/'+$scope.id);
            });
        };   
                        },function(error) {
                            $location.url('/page/profile/'+$cookies.getObject('user').type);
                        });
                },function(error) {
                    $location.url('/page/profile/'+$cookies.getObject('user').type);
                });
            },
            function(error) {
                $location.url('/page/profile/'+$cookies.getObject('user').type);
            });

    }

    function removeSchoolCtrl ($scope, $location, $cookies, SchoolService, UserService, StorageService, $stateParams) {
        //Must warn user
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        //StorageService.load();
        //$scope.school = StorageService.school_by_id($scope.id);
        $scope.message = '';
        $scope.button = 'ELIMINAR ESCOLA';

        SchoolService.get({id: $scope.id},function(response) {
           $scope.school = response;
           UserService.query({school: $scope.school._id, type: 'manager'},function(response) {
                            $scope.manager = response[0];

        $scope.canDelete = function() {

            if($cookies.getObject('user').type != 'admin'){
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if(!$scope.school || !$scope.userForm){ $scope.form_error = true; $scope.message = 'Escola Inválida'; return false; }
            if($scope.id == $cookies.getObject('user').school){ $scope.form_error = true; $scope.message = 'Contacte um administrador para eliminar a sua escola'; return false; }
            return true;
        };

        $scope.delete = function() {
            UserService.delete({id: $scope.manager._id},function(response){ 
                $location.url('/page/school/list');
            },function(error){ 
                $scope.form_error = true;
                $scope.message = error.message;
            });

        };                   

                          },function(error) {
                                if(!$scope.school){console.log('no manager');$location.url('/page/profile/'+$cookies.getObject('user').type);}
                          });
                            
        },function(error) {
           if(!$scope.school){console.log('no school');$location.url('/page/profile/'+$cookies.getObject('user').type);}
        });
    }

    function removeCourseCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        $scope.message = '';
        $scope.button = 'ELIMINAR CURSO';

        CourseService.get({id: $scope.id},
            function(response) {
            $scope.course = response;
            SchoolService.get({id: $scope.course.school},
                function(response) {
                    $scope.school = response;
        $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.school._id)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if(!$scope.course){ $scope.form_error = true; $scope.message = 'Curso Inválido'; return false; }
            return true;
        };

        $scope.delete = function() {
            CourseService.delete({id: $scope.course._id},function(response){ 
                $location.url('/page/school/courses/'+$scope.school._id);
            },function(error){ 
                $scope.form_error = true;
                $scope.message = error.message;
            });

        };
                },function(error) {
                    $location.url('/page/profile/'+$cookies.getObject('user').type);
                });
            },
            function(error) {
                $location.url('/page/profile/'+$cookies.getObject('user').type);
            });
    }

    function removeSubjectCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        $scope.message = '';
        $scope.button = 'ELIMINAR DISCIPLINA';

        SubjectService.get({id: $scope.id},
            function(response) {
            $scope.subject = response;
            SchoolService.get({id: $scope.subject.school},
                function(response) {
                    $scope.school = response;
        $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.school._id)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if(!$scope.subject){ $scope.form_error = true; $scope.message = 'Disciplina Inválida'; return false; }
            return true;
        };

        $scope.delete = function() {
            SubjectService.delete({id: $scope.subject._id},function(response){ 
                $location.url('/page/course/subjects/'+$scope.subject.course);
            },function(error){ 
                $scope.form_error = true;
                $scope.message = error.message;
            });

        };
                },function(error) {
                    $location.url('/page/profile/'+$cookies.getObject('user').type);
                });
            },
            function(error) {
                $location.url('/page/profile/'+$cookies.getObject('user').type);
            });
    }

    function removeScheduleCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        $scope.message = '';
        $scope.button = 'ELIMINAR HORÁRIO';

        ScheduleService.get({id: $scope.id},
            function(response) {
            $scope.schedule = response;
            SchoolService.get({id: $scope.schedule.school},
                function(response) {
                    $scope.school = response;
        $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.school._id)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if(!$scope.schedule){ $scope.form_error = true; $scope.message = 'Horário Inválido'; return false; }
            return true;
        };

        $scope.delete = function() {
            ScheduleService.delete({id: $scope.schedule._id},function(response){ 
                $location.url('/page/professor/schedules/'+$scope.schedule.professor);
            },function(error){ 
                $scope.form_error = true;
                $scope.message = error.message;
            });

        };
                },function(error) {
                    $location.url('/page/profile/'+$cookies.getObject('user').type);
                });
            },
            function(error) {
                $location.url('/page/profile/'+$cookies.getObject('user').type);
            });


    }
})(); 