(function () {
    'use strict';

    angular.module('app.subject', ['ngResource','validation.match','angularRandomString'])
        .factory("UserService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/users/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SchoolService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/schools/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("CourseService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/courses/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SubjectService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/subjects/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("CourseNameService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/coursenames/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .factory("SubjectNameService", function ($resource){return $resource("http://classbook.nellcorp.com:3002/subjectnames/:id",{Id: "@id" },{"update": {method: "PUT"}});})
        .controller('createSubjectCtrl', ['$scope','$location','SchoolService','CourseService','SubjectService','SubjectNameService','$stateParams',createSubjectCtrl])
        .controller('subjectClassCtrl', ['$scope','$location','randomString', 'SchoolService','CourseService', 'SubjectService','$stateParams',subjectClassCtrl])
        .controller('subjectCtrl', ['$scope','$location','CourseService','SubjectService','SubjectNameService','$stateParams',subjectCtrl])
        .controller('batchSubjectCtrl', ['$scope','$location','SchoolService','CourseService','CourseNameService','SubjectService','SubjectNameService','$stateParams',batchSubjectCtrl])
        .controller('batchSchoolSubjectCtrl', ['$scope','$location','SchoolService','CourseService','CourseNameService','SubjectService','SubjectNameService','$stateParams',batchSchoolSubjectCtrl]);


    function createSubjectCtrl ($scope, $location, SchoolService, CourseService, SubjectService, SubjectNameService, $stateParams) {
        $scope.id = $stateParams.id;
        
        $scope.subject = {
            name: '',
            course: '',
            school: '',
            year: ''
        };

        CourseService.query({school: $scope.id},function(courses) {
                $scope.courses = courses;
                $scope.subject.school = courses[0].school;
                console.log($scope.courses);
            });

        //SubjectNameService.query(function(subjects) {$scope.subjects = subjects;});

        
        var orig_subject = angular.copy($scope.subject);
    
        $scope.canSubmit = function() {
            return $scope.userForm.$valid && !angular.equals($scope.subject, orig_subject);
        };    
        
        $scope.submitForm = function() {

            SubjectService.save($scope.subject,function(response){
                console.log(response);
                SubjectNameService.save({name: $scope.subject.name},function(response){console.log(response);});
                $location.url('/page/school/subjects/'+$scope.id);
            });
        };           
    }

    function subjectCtrl ($scope, $location, CourseService, SubjectService, SubjectNameService, $stateParams) {
        $scope.id = $stateParams.id;
        
        SubjectService.get({id: $scope.id},function(subject) {
            $scope.subject = subject;
            
            CourseService.get({id: $scope.subject.course},function(course) {
                console.log(course);
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
                console.log(response);
                
                SubjectNameService.save({name: $scope.subject.name},function(response){
                    console.log(response);
                });
            });

        };           
        
        
    }

    function batchSubjectCtrl ($scope, $location, SchoolService, CourseService, CourseNameService, SubjectService, SubjectNameService, $stateParams) {
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
            for( var i = 0; i < subjects.length; i++ ) {

                temp = subjects[i].split( "," );
                console.log(temp);

                if(temp.length == 2 && temp[1] > 0 && temp[1] < 6){
                    var subject = {
                                    name: temp[0],
                                    school: $scope.course.school,
                                    course: $scope.course._id,
                                    year: temp[1],
                            };
                
                    SubjectService.save(subject,function(response){
                        console.log(response);
                        SubjectNameService.save({name: temp[0]},function(response){console.log(response);});
                    });
                }
            }

        $location.url('/page/course/subjects/'+$scope.id);
        };           
        
        
    }

    function batchSchoolSubjectCtrl ($scope, $location, SchoolService, CourseService, CourseNameService, SubjectService, SubjectNameService, $stateParams) {
        $scope.id = $stateParams.id;
        
        $scope.batch = '';

        SchoolService.get({id: $scope.id},function(school) {$scope.school = school;});
        
        $scope.canSubmit = function() {
            return $scope.userForm.$valid;
        };    
        
        $scope.submitForm = function() {
            
            var subjects = $scope.batch.split( "\n" );

            var temp = [];
            //curso,firstname,lastname,email,telefone
            for( var i = 0; i < subjects.length; i++ ) {

                temp = subjects[i].split( "," );
                console.log(temp);

                if(temp.length == 3 && temp[2] > 0 && temp[2] < 6){
                    
                    CourseService.query({name: temp[1], school: $scope.school._id},function(courses) {
                        
                        if(courses.length != 0){
                            var subject = { name: temp[0], school: $scope.school._id, course: courses[0]._id, year: temp[2] };
                            SubjectService.save(subject,function(response){
                                console.log(response);
                                SubjectNameService.save({name: temp[0]},function(response){console.log(response);});
                            });
                        }
                    });
                }
            }

        $location.url('/page/school/subjects/'+$scope.id);
        };           
        
        
    }

    function subjectClassCtrl ($scope, $location, randomString, SchoolService, CourseService, SubjectService, $stateParams) {
        $scope.id = $stateParams.id;
        
        CourseService.get({id: $scope.id},function(course) {
                $scope.course = course;
                
                SubjectService.query({course: course.name, school: course.school.toLowerCase()},function(subjects) {
                    $scope.subjects = subjects;
                    console.log(subjects);
                });
            });
        
    }

})(); 