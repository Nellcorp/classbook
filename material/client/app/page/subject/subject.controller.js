(function () {
    'use strict';

    angular.module('app.subject', ['app.service','validation.match','angularRandomString'])
        .controller('createSubjectCtrl', ['$scope','$location','SchoolService','CourseService','SubjectService','SubjectNameService','$stateParams',createSubjectCtrl])
        .controller('subjectClassCtrl', ['$scope','$location','randomString', 'SchoolService','CourseService', 'SubjectService','$stateParams',subjectClassCtrl])
        .controller('subjectCtrl', ['$scope','$location','CourseService','SubjectService','SubjectNameService','$stateParams',subjectCtrl])
        .controller('batchSubjectCtrl', ['$scope','$q','$location','SchoolService','CourseService','CourseNameService','SubjectService','SubjectNameService','StorageService','$stateParams',batchSubjectCtrl])
        .controller('batchSchoolSubjectCtrl', ['$scope','$q','$location','SchoolService','CourseService','CourseNameService','SubjectService','SubjectNameService','StorageService','$stateParams',batchSchoolSubjectCtrl]);


    function createSubjectCtrl ($scope, $location, SchoolService, CourseService, SubjectService, SubjectNameService, $stateParams) {
        $scope.id = $stateParams.id;
        
        $scope.subject = {
            name: '',
            description: '',
            course: '',
            school: '',
            year: ''
        };

        CourseService.query({school: $scope.id},function(courses) {
                $scope.courses = courses;
                $scope.subject.school = courses[0].school;
                //console.log($scope.courses);
            });

        //SubjectNameService.query(function(subjects) {$scope.subjects = subjects;});

        
        var orig_subject = angular.copy($scope.subject);
    
        $scope.canSubmit = function() {
            return $scope.userForm.$valid && !angular.equals($scope.subject, orig_subject);
        };    
        
        $scope.submitForm = function() {

            SubjectService.save($scope.subject,function(response){
                //console.log(response);
                //SubjectNameService.save({name: $scope.subject.name},function(response){console.log(response);});
                $location.url('/page/school/subjects/'+$scope.id);
            });
        };           
    }

    function subjectCtrl ($scope, $location, CourseService, SubjectService, SubjectNameService, $stateParams) {
        $scope.id = $stateParams.id;
        
        SubjectService.get({id: $scope.id},function(subject) {
            $scope.subject = subject;
            
            CourseService.get({id: $scope.subject.course},function(course) {
                //console.log(course);
                $scope.course = course;
            }); 
        });
        

        var orig_subject = angular.copy($scope.subject);

        $scope.canSubmit = function() {
            return $scope.userForm.$valid && !angular.equals($scope.subject, orig_subject);
        };    
        
        $scope.submitForm = function() {
            //$scope.showInfoOnSubmit = true;

            SubjectService.update({id: $scope.subject._id},$scope.subject,function(response){
                //console.log(response);
                
                //SubjectNameService.save({name: $scope.subject.name},function(response){ console.log(response); });
            });

        };           
        
        
    }

    function batchSubjectCtrl ($scope, $q, $location, SchoolService, CourseService, CourseNameService, SubjectService, SubjectNameService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        
        $scope.batch = '';

        CourseService.get({id: $scope.id},function(course) {$scope.course = course;});
        
        
        $scope.canSubmit = function() {
            return $scope.userForm.$valid;
        };    
        
        $scope.submitForm = function() {
            
            var subjects = $scope.batch.split( "\n" );

            var temp = [];
            //curso,firstname,lastname,email,telefone
            var chain = $q.when();
            
            angular.forEach(subjects, function(value,key){
                var temp = value.split( "," );
                console.log(temp);
                if(temp.length == 2 && temp[1] > 0 && temp[1] < 6){
                    var subject = {
                                    name: temp[0],
                                    school: $scope.course.school,
                                    description: 'Sem Descrição',
                                    course: $scope.course._id,
                                    year: temp[1],
                            };
                    chain = chain.then(function(){
                        SubjectService.save(subject,function(response){
                        //SubjectNameService.save({name: temp[0]},function(response){console.log(response);});
                    });
                });
                    
                }
                
                });

                chain.then(function(){
                    //console.log('all done!');
                    $location.url('/page/course/subjects/'+$scope.id);
                });
            };
    }

    function batchSchoolSubjectCtrl ($scope, $q, $location, SchoolService, CourseService, CourseNameService, SubjectService, SubjectNameService, StorageService, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.ready = [];
        
        $scope.batch = '';

        SchoolService.get({id: $scope.id},function(school) {$scope.school = school;});
        
        $scope.canSubmit = function() {
            $scope.ready = [];
            var valid = true;
            var school = /^[0-9a-fA-F]{24}$/;
            var subjects = StorageService.subjects();
            var courses = StorageService.courses();
            var found = false;


            var lines = $scope.batch.split( "\n" );
            //cadeira1,curso1,1
            for( var i = 0; i < lines.length; i++ ) {
                var temp = lines[i].split( "," );
                if(temp.length != 3 || temp[2] < 1 || temp[2] > 5){ return false;}
                for( var j = 0; j < subjects.length; j++ ) { if(temp[0] == subjects[j].name){ return false;} }
                for( var j = 0; j < courses.length; j++ ) {
                    if(temp[1] == courses[j].name){
                        $scope.ready.push({ name: temp[0], school: $scope.id, description: 'Sem Descrição', year: temp[2], course: courses[j]._id });
                        found = true; break;
                    }
                }
                
            }
            
            return $scope.userForm.$valid && valid && found;
        };    
        
        $scope.submitForm = function() {
            var chain = $q.when();
            
            //curso,firstname,lastname,email,telefone
            chain = chain.then(function(){
                for(var i = 0; i < $scope.ready.length; i++){ SubjectService.save($scope.ready[i],function(response){ console.log(response);}); }
            });
            chain.then(function(){
                StorageService.load();
                $location.url('/page/school/subjects/'+$scope.id);
            });
        };           
        
        
    }

    function subjectClassCtrl ($scope, $location, randomString, SchoolService, CourseService, SubjectService, $stateParams) {
        $scope.id = $stateParams.id;
        
        CourseService.get({id: $scope.id},function(course) {
                $scope.course = course;
                
                SubjectService.query({course: course.name, school: course.school.toLowerCase()},function(subjects) {
                    $scope.subjects = subjects;
                    //console.log(subjects);
                });
            });
        
    }

})(); 