(function () {
    'use strict';

    angular.module('app.delete', ['app.service','validation.match','angularRandomString','ngCookies'])
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
        StorageService.load();
        $scope.school = StorageService.school_by_id($scope.id);
        if(!$scope.school){$location.url('/page/profile/'+$cookies.getObject('user').id);}
        var temp = StorageService.subjects();
        var subjects = [];

        for (var i = 0; i < temp.length; i++) {
            if(temp[i].school == $scope.id){
                subjects.push(temp[i]);
            }
        };
        
        $scope.button = 'ELIMINAR TODAS AS DISCIPLINAS DA ESCOLA';
        $scope.message = '';

        $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.id)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if(subjects.length == 0){
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
                for(var i = 0; i < subjects.length; i++){
                    SubjectService.delete({id: subjects[i]._id},function(response){},function(error){  $scope.form_error = true; $scope.message = error.message; });}
            });
            chain.then(function(){
               $location.url('/page/school/subjects/'+$scope.id);
            });
        };                    
}

function removeSchoolCourseCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {        $scope.id = $stateParams.id;
        $scope.form_error = false;
        StorageService.load();
        $scope.school = StorageService.school_by_id($scope.id);
        if(!$scope.school){$location.url('/page/profile/'+$cookies.getObject('user').id);}
        var temp = StorageService.courses();
        var courses = [];

        for (var i = 0; i < temp.length; i++) {
            if(temp[i].school == $scope.id){
                courses.push(temp[i]);
            }
        };
        
        $scope.button = 'ELIMINAR TODOS OS CURSOS DA ESCOLA';
        $scope.message = '';

        $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.id)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if(courses.length == 0){
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
                for(var i = 0; i < courses.length; i++){
                    CourseService.delete({id: courses[i]._id},function(response){},function(error){  $scope.form_error = true; $scope.message = error.message; });}
            });
            chain.then(function(){
               $location.url('/page/school/courses/'+$scope.id);
            });
        };                    
}

function removeSchoolScheduleCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        StorageService.load();
        $scope.school = StorageService.school_by_id($scope.id);
        if(!$scope.school){$location.url('/page/profile/'+$cookies.getObject('user').id);}
        var temp = StorageService.schedules();
        var schedules = [];

        for (var i = 0; i < temp.length; i++) {
            if(temp[i].school == $scope.id){
                schedules.push(temp[i]);
            }
        };
        
        $scope.button = 'ELIMINAR TODOS OS HORÁRIOS DA ESCOLA';
        $scope.message = '';

        $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.id)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if(schedules.length == 0){
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
                for(var i = 0; i < schedules.length; i++){
                    ScheduleService.delete({id: schedules[i]._id},function(response){},function(error){  $scope.form_error = true; $scope.message = error.message; });}
            });
            chain.then(function(){
               $location.url('/page/school/schedules/'+$scope.id);
            });
        };                    
}

function removeCourseSubjectCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        StorageService.load();
        $scope.course = StorageService.course_by_id($scope.id);
        if(!$scope.course){$location.url('/page/profile/'+$cookies.getObject('user').id);}

        $scope.school = StorageService.school_by_id($scope.course.school);
        if(!$scope.school){$location.url('/page/profile/'+$cookies.getObject('user').id);}
        var temp = StorageService.subjects();
        var subjects = [];

        for (var i = 0; i < temp.length; i++) {
            if(temp[i].course == $scope.id){
                subjects.push(temp[i]);
            }
        };
        
        $scope.button = 'ELIMINAR TODAS AS DISCIPLINAS DO CURSO';
        $scope.message = '';

        $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.school._id)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if(subjects.length == 0){
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
                for(var i = 0; i < subjects.length; i++){
                    SubjectService.delete({id: subjects[i]._id},function(response){},function(error){  $scope.form_error = true; $scope.message = error.message; });}
            });
            chain.then(function(){
               $location.url('/page/course/subjects/'+$scope.id);
            });
        };   
}
function removeSubjectScheduleCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        StorageService.load();
        $scope.subject = StorageService.subject_by_id($scope.id);
        if(!$scope.subject){$location.url('/page/profile/'+$cookies.getObject('user').id);}

        $scope.school = StorageService.school_by_id($scope.subject.school);
        var temp = StorageService.schedules();
        var schedules = [];

        for (var i = 0; i < temp.length; i++) {
            if(temp[i].subject == $scope.id){ schedules.push(temp[i]); }
        };
        
        $scope.button = 'ELIMINAR HORÁRIOS DA DISCIPLINA';
        $scope.message = '';

        $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.school._id)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if(schedules.length == 0){
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
                for(var i = 0; i < schedules.length; i++){
                    ScheduleService.delete({id: schedules[i]._id},function(response){},function(error){  $scope.form_error = true; $scope.message = error.message; });}
            });
            chain.then(function(){
               $location.url('/page/subject/schedules/'+$scope.id);
            });
        };
}
function removeProfessorScheduleCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        StorageService.load();
        $scope.professor = StorageService.user_by_id($scope.id);
        if(!$scope.professor){$location.url('/page/profile/'+$cookies.getObject('user').id);}

        $scope.school = StorageService.school_by_id($scope.professor.school);
        var temp = StorageService.schedules();
        var schedules = [];

        for (var i = 0; i < temp.length; i++) {
            if(temp[i].professor == $scope.id){ schedules.push(temp[i]); }
        };
        
        $scope.button = 'ELIMINAR HORÁRIOS DO PROFESSOR';
        $scope.message = '';

        $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.school._id)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if(schedules.length == 0){
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
                for(var i = 0; i < schedules.length; i++){
                    ScheduleService.delete({id: schedules[i]._id},function(response){},function(error){  $scope.form_error = true; $scope.message = error.message; });}
            });
            chain.then(function(){
               $location.url('/page/professor/schedules/'+$scope.id);
            });
        };   
}

    
    function removeUserCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        //Cannot delete if user
        //is admin
        //is professor assigned to schedule
        //is manager (must delete school)

        $scope.id = $stateParams.id;
        $scope.form_error = false;
        $scope.message = '';
        StorageService.load();
        $scope.schedules = StorageService.schedules_by_user();
        $scope.users = StorageService.users_by_id();
        
        if(!$scope.users.hasOwnProperty($scope.id)){$location.url('/page/profile/'+$cookies.getObject('user').id);}
        $scope.user = $scope.users[$scope.id];

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
                $location.url('/page/profile/'+$cookies.getObject('user').id);
            },function(error){ 
                $scope.form_error = true;
                $scope.message = error.message;
            });

        };           
        
        
    }

    function removeSchoolProfCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        //Must warn user
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        StorageService.load();
        $scope.school = StorageService.school_by_id($scope.id);
        if(!$scope.school){$location.url('/page/profile/'+$cookies.getObject('user').id);}
        var users = StorageService.users();
        var professors = [];

        for (var i = 0; i < users.length; i++) {
            if(users[i].type == 'professor' && users[i].school == $scope.id){
                professors.push(users[i]);
            }
        };
        
        $scope.button = 'ELIMINAR TODOS OS PROFESSORES E HORÁRIOS DA ESCOLA';
        $scope.message = '';

        $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.id)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if(professors.length == 0){
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
                for(var i = 0; i < professors.length; i++){
                    UserService.delete({id: professors[i]._id},function(response){},function(error){  $scope.form_error = true; $scope.message = error.message; });}
            });
            chain.then(function(){
               $location.url('/page/school/professors/'+$scope.id);
            });
        };                    
    }

    function removeSchoolStudentCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        StorageService.load();
        $scope.school = StorageService.school_by_id($scope.id);
        if(!$scope.school){$location.url('/page/profile/'+$cookies.getObject('user').id);}
        var users = StorageService.users();
        var students = [];

        for (var i = 0; i < users.length; i++) {
            if(users[i].type == 'student' && users[i].school == $scope.id){
                students.push(users[i]);
            }
        };
        
        $scope.button = 'ELIMINAR TODOS OS ESTUDANTES DA ESCOLA';
        $scope.message = '';

        $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.id)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if(students.length == 0){
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
                for(var i = 0; i < students.length; i++){
                    UserService.delete({id: students[i]._id},function(response){},function(error){  $scope.form_error = true; $scope.message = error.message; });}
            });
            chain.then(function(){
               $location.url('/page/school/students/'+$scope.id);
            });
        };                    
    }

    function removeCourseStudentCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        StorageService.load();
        $scope.course = StorageService.course_by_id($scope.id);
        if(!$scope.course){$location.url('/page/profile/'+$cookies.getObject('user').id);}

        $scope.school = StorageService.school_by_id($scope.course.school);
        if(!$scope.school){$location.url('/page/profile/'+$cookies.getObject('user').id);}
        var users = StorageService.users();
        var students = [];

        for (var i = 0; i < users.length; i++) {
            if(users[i].type == 'student' && users[i].school == $scope.course.school && users[i].course == $scope.id){
                students.push(users[i]);
            }
        };
        
        $scope.button = 'ELIMINAR TODOS OS ESTUDANTES DO CURSO';
        $scope.message = '';

        $scope.canDelete = function() {

            if($cookies.getObject('user').type == 'admin' || ($cookies.getObject('user').type == 'manager' && $cookies.getObject('user').school == $scope.school._id)){
                //all good
            }else{
                $scope.form_error = true;
                $scope.message = 'Não está autorizado a realizar esta operação';
                return false;
            }

            if(students.length == 0){
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
                for(var i = 0; i < students.length; i++){
                    UserService.delete({id: students[i]._id},function(response){},function(error){  $scope.form_error = true; $scope.message = error.message; });}
            });
            chain.then(function(){
               $location.url('/page/course/students/'+$scope.id);
            });
        };   
    }

    function removeSchoolCtrl ($scope, $location, $cookies, SchoolService, UserService, StorageService, $stateParams) {
        //Must warn user
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        StorageService.load();
        $scope.school = StorageService.school_by_id($scope.id);
        var users = StorageService.users();
        if(!$scope.school){$location.url('/page/profile/'+$cookies.getObject('user').id);}

        for (var i = 0; i < users.length; i++) {
            if(users[i].type == 'manager' && users[i].school == $scope.id){
                $scope.manager = users[i]; break;
            }
        };
        
        if(!$scope.manager){$location.url('/page/profile/'+$cookies.getObject('user').id);}

        $scope.message = '';
        $scope.button = 'ELIMINAR ESCOLA';

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
    }

    function removeCourseCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        StorageService.load();
        $scope.course = StorageService.course_by_id($scope.id);
        $scope.school = StorageService.school_by_id($scope.course.school);
        
        if(!$scope.course || !$scope.school){$location.url('/page/profile/'+$cookies.getObject('user').id);}

        $scope.message = '';
        $scope.button = 'ELIMINAR CURSO';

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
    }

    function removeSubjectCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        StorageService.load();
        $scope.subject = StorageService.subject_by_id($scope.id);
        $scope.school = StorageService.school_by_id($scope.subject.school);
        
        if(!$scope.subject || !$scope.school){$location.url('/page/profile/'+$cookies.getObject('user').id);}

        $scope.message = '';
        $scope.button = 'ELIMINAR DISCIPLINA';

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
    }

    function removeScheduleCtrl ($scope, $location, $cookies, $q, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.form_error = false;
        StorageService.load();
        $scope.schedule = StorageService.schedule_by_id($scope.id);
        $scope.school = StorageService.school_by_id($scope.schedule.school);
        
        if(!$scope.schedule || !$scope.school){$location.url('/page/profile/'+$cookies.getObject('user').id);}

        $scope.message = '';
        $scope.button = 'ELIMINAR HORÁRIO';

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
    }
})(); 