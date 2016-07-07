(function () {
    'use strict';

    angular.module('app')
        .controller('adminDashboardCtrl', ['$scope', '$q','$cookies', 'StorageService','CourseService','UserService','SchoolService','SubjectService','ScheduleService','SessionService','AbsenceService',adminDashboardCtrl])
        .controller('managerDashboardCtrl', ['$scope', '$q','$cookies', 'StorageService','CourseService','UserService','SchoolService','SubjectService','ScheduleService','SessionService','AbsenceService',managerDashboardCtrl])
        .controller('professorDashboardCtrl', ['$scope', '$q','$cookies', 'StorageService','CourseService','UserService','SchoolService','SubjectService','ScheduleService','SessionService','AbsenceService',professorDashboardCtrl])
        .controller('studentDashboardCtrl', ['$scope', '$q','$cookies', 'StorageService','CourseService','UserService','SchoolService','SubjectService','ScheduleService','SessionService','AbsenceService',studentDashboardCtrl])
        .controller('DashboardCtrl', ['$scope', '$q','$cookies', 'StorageService','CourseService','UserService','SchoolService','SubjectService','ScheduleService','SessionService','AbsenceService',DashboardCtrl])

    function adminDashboardCtrl($scope, $q, $cookies, StorageService, CourseService, UserService, SchoolService, SubjectService, ScheduleService, SessionService, AbsenceService) {

        var promises = [];
        promises.push(UserService.query({},function(response) { $scope.users  = response.length;}).$promise);
        promises.push(UserService.query({type: 'student'},function(response) { $scope.students  = response.length;}).$promise);
        promises.push(UserService.query({type: 'professor'},function(response) { $scope.professors  = response.length;}).$promise);
        promises.push(SchoolService.query({},function(response) { $scope.schools  = response.length;}).$promise);
        promises.push(AbsenceService.query({},function(response) { $scope.absences  = response.length;}).$promise);
        promises.push(CourseService.query({},function(response) { $scope.courses  = response.length;}).$promise);
        promises.push(SubjectService.query({},function(response) { $scope.subjects  = response.length;}).$promise);
        promises.push(SessionService.query({},function(response) { $scope.sessions  = response.length;}).$promise);

        $q.all(promises).then(function(){
            $scope.stats = [
            { name: 'UTILIZADORES', icon: 'zmdi-local-airport', value: $scope.users, unit: '', color: 'color-success' },
            { name: 'ESTUDANTES', icon: 'zmdi-graduation-cap', value: $scope.students, unit: '', color: 'color-info' },
            { name: 'PROFESSORES', icon: 'zmdi-accounts-alt', value: $scope.professors, unit: '', color: 'color-warning' },
            { name: 'ESCOLAS', icon: 'zmdi-home', value: $scope.schools, unit: '', color: 'color-danger' },
            { name: 'FALTAS', icon: 'zmdi-calendar-close', value: $scope.absences, unit: '', color: 'color-success' },
            { name: 'AULAS', icon: 'zmdi-edit', value: $scope.sessions, unit: '', color: 'color-info' },
            { name: 'CURSOS', icon: 'zmdi-puzzle-piece', value: $scope.courses, unit: '', color: 'color-warning' },
            { name: 'DISCIPLINAS', icon: 'zmdi-library', value: $scope.subjects, unit: '', color: 'color-danger' }
        ];
        });

            
    }

    function managerDashboardCtrl($scope, $q, $cookies, StorageService, CourseService, UserService, SchoolService, SubjectService, ScheduleService, SessionService, AbsenceService) {

        var user = $cookies.getObject('user');
        console.log('Page Profile',JSON.stringify($cookies.getObject('user')));
        var school = user.school;
        var promises = [];

        promises.push(UserService.query({school: school},function(response) {
            console.log('user',JSON.stringify(user));
            console.log('users',JSON.stringify(response));
            $scope.school_users  = response.length;
            $scope.school_students = 0;
            $scope.school_professors = 0;

            var students = {};
            var professors = {};
            var professor_absences = [];
            var student_absences = 0;
            var absences = [];

            for (var i = 0; i < response.length; i++) {
                if(response[i].type == 'professor'){ professors[response[i]._id] = response[i]; $scope.school_professors +=1;}
                if(response[i].type == 'student'){ students[response[i]._id] = response[i]; $scope.school_students +=1;}
            };
            
            $scope.school_student_absences = 0;
            $scope.school_professor_absences = 0;

            promises.push(AbsenceService.query({school: school},function(response) {
                $scope.absences  = response.length;
                for (var i = 0; i < response.length; i++) {
                    console.log(response[i].user);
                    console.log(students);
                  if(students.hasOwnProperty(response[i].user)){ $scope.school_student_absences +=1;}
                  if(professors.hasOwnProperty(response[i].user)){ $scope.school_professor_absences +=1;}
            };
            }).$promise);

        }).$promise);
        
        
        promises.push(SessionService.query({school: school},function(response) { $scope.sessions  = response.length;}).$promise);
        promises.push(CourseService.query({school: school},function(response) { $scope.courses  = response.length;}).$promise);
        promises.push(SubjectService.query({school: school},function(response) { $scope.subjects  = response.length;}).$promise);
        

    $q.all(promises).then(function(){

        
        $scope.stats = [
            { name: 'CURSOS', icon: 'zmdi-puzzle-piece', value: $scope.courses, unit: '', color: 'color-warning' },
            { name: 'DISCIPLINAS', icon: 'zmdi-library', value: $scope.subjects, unit: '', color: 'color-danger' },
            { name: 'AULAS', icon: 'zmdi-edit', value: $scope.sessions, unit: '', color: 'color-info' },
            { name: 'UTILIZADORES', icon: 'zmdi-local-airport', value: $scope.school_users, unit: '', color: 'color-success' },
            { name: 'ESTUDANTES', icon: 'zmdi-graduation-cap', value: $scope.school_students, unit: '', color: 'color-info' },
            { name: 'PROFESSORES', icon: 'zmdi-accounts-alt', value: $scope.school_professors, unit: '', color: 'color-warning' },
            { name: 'FALTAS DE PROFESSORES', icon: 'zmdi-calendar-close', value: $scope.school_professor_absences, unit: '', color: 'color-success' },
            { name: 'FALTAS DE ESTUDANTES', icon: 'zmdi-calendar-close', value: $scope.school_student_absences, unit: '', color: 'color-success' }
        ];
        });
    }

    function professorDashboardCtrl($scope, $q, $cookies, StorageService, CourseService, UserService, SchoolService, SubjectService, ScheduleService, SessionService, AbsenceService) {

        var user = $cookies.getObject('user');
        //console.log('Page Profile',JSON.stringify($cookies.getObject('user')));
        var school = user.school;
        var promises = [];
        $scope.absences = [];
        $scope.sessions = [];
        $scope.subjects = {};
        $scope.subject_names = [];
        $scope.schedules = [];

        promises.push(AbsenceService.query({user: user.id},function(response) { $scope.absences  = response; }).$promise);
        promises.push(SessionService.query({professor: user.id},function(response) { $scope.sessions  = response;}).$promise);
        promises.push(SubjectService.query({school: school},function(subjects) { for (var i = 0; i < subjects.length; i++) { $scope.subjects[subjects[i]._id] = subjects[i].name; }; }).$promise);
        promises.push(ScheduleService.query({professor: user.id},function(schedules) { $scope.schedules = schedules; }).$promise);
        

    $q.all(promises).then(function(){
        if($scope.sessions.length == 0){
            $scope.ratio = 0;
        }else{
            $scope.ratio = ($scope.absences.length / $scope.sessions.length)*100;
        }

        for (var i = 0; i < $scope.schedules.length; i++) { $scope.subject_names.push($scope.subjects[$scope.schedules[i].subject]); };

        $scope.stats = [
            { name: 'MINHAS DISCIPLINAS', icon: 'zmdi-library', value: $scope.subject_names.length, unit: '', color: 'color-danger' },
            { name: 'AULAS DADAS', icon: 'zmdi-edit', value: $scope.sessions.length, unit: '', color: 'color-info' },
            { name: 'MINHAS FALTAS', icon: 'zmdi-calendar-close', value: $scope.absences.length, unit: '', color: 'color-success' },
            { name: 'FALTAS POR AULA', icon: 'zmdi-calendar-close', value: $scope.ratio, unit: '%', color: 'color-success' }
        ];
        });
    }

    function studentDashboardCtrl($scope, $q, $cookies, StorageService, CourseService, UserService, SchoolService, SubjectService, ScheduleService, SessionService, AbsenceService) {
        $scope.stats = [
            { name: 'UTILIZADORES', icon: 'zmdi-local-airport', value: StatsService.users(), unit: '', color: 'color-success' },
            { name: 'ESTUDANTES', icon: 'zmdi-graduation-cap', value: StatsService.students(), unit: '', color: 'color-info' },
            { name: 'PROFESSORES', icon: 'zmdi-accounts-alt', value: StatsService.professors(), unit: '', color: 'color-warning' },
            { name: 'ESCOLAS', icon: 'zmdi-home', value: StatsService.schools(), unit: '', color: 'color-danger' },
            { name: 'FALTAS', icon: 'zmdi-calendar-close', value: StatsService.absences(), unit: '', color: 'color-success' },
            { name: 'AULAS', icon: 'zmdi-edit', value: StatsService.sessions(), unit: '', color: 'color-info' },
            { name: 'CURSOS', icon: 'zmdi-puzzle-piece', value: StatsService.courses(), unit: '', color: 'color-warning' },
            { name: 'DISCIPLINAS', icon: 'zmdi-library', value: StatsService.subjects(), unit: '', color: 'color-danger' }
        ];
    }

    function DashboardCtrl($scope, $q, $cookies, StorageService, CourseService, UserService, SchoolService, SubjectService, ScheduleService, SessionService, AbsenceService) {
        $scope.smline1 = {}; $scope.smline2 = {}; $scope.smline3 = {}; $scope.smline4 = {};

        
        $scope.smline1.options = {
            tooltip: { show: false, trigger: 'axis', axisPointer: { lineStyle: { color: $scope.color.gray } } }, 
            grid: { x: 1, y: 1, x2: 1, y2: 1, borderWidth: 0 },            
            xAxis : [ { type : 'category', show: false, boundaryGap : false, data : [1,2,3,4,5,6,7] } ],
            yAxis : [ { type : 'value', show: false, axisLabel : { formatter: '{value} °C' } } ],
            series : [ { name:'*', type:'line', symbol: 'none', data:[11, 11, 15, 13, 12, 13, 10], itemStyle: { normal: { color: $scope.color.info } } } ]
        };
        
        $scope.smline2.options = {
            tooltip: { show: false, trigger: 'axis', axisPointer: { lineStyle: { color: $scope.color.gray } } }, 
            grid: { x: 1, y: 1, x2: 1, y2: 1, borderWidth: 0 },            
            xAxis : [ { type : 'category', show: false, boundaryGap : false, data : [1,2,3,4,5,6,7] } ],
            yAxis : [ { type : 'value', show: false, axisLabel : { formatter: '{value} °C' } } ],
            series : [ { name:'*', type:'line', symbol: 'none', data:[11, 11, 15, 13, 12, 13, 10], itemStyle: { normal: { color: $scope.color.success } } } ]
        };

        $scope.smline3.options = {
            tooltip: { show: false, trigger: 'axis', axisPointer: { lineStyle: { color: $scope.color.gray } } }, 
            grid: { x: 1, y: 1, x2: 1, y2: 1, borderWidth: 0 },            
            xAxis : [ { type : 'category', show: false, boundaryGap : false, data : [1,2,3,4,5,6,7] } ],
            yAxis : [ { type : 'value', show: false, axisLabel : { formatter: '{value} °C' } } ],
            series : [ { name:'*', type:'line', symbol: 'none', data:[11, 11, 15, 13, 12, 13, 10], itemStyle: { normal: { color: $scope.color.danger } } } ]
        };

        $scope.smline4.options = {
            tooltip: { show: false, trigger: 'axis', axisPointer: { lineStyle: { color: $scope.color.gray } } }, 
            grid: { x: 1, y: 1, x2: 1, y2: 1, borderWidth: 0 },            
            xAxis : [ { type : 'category', show: false, boundaryGap : false, data : [1,2,3,4,5,6,7] } ],
            yAxis : [ { type : 'value', show: false, axisLabel : { formatter: '{value} °C' } } ],
            series : [ { name:'*', type:'line', symbol: 'none', data:[11, 11, 15, 13, 12, 13, 10], itemStyle: { normal: { color: $scope.color.warning } } } ]
        };



        // Engagment pie charts
        var labelTop =  StorageService.labelTop;
        var labelFromatter = StorageService.labelFromatter;
        var labelBottom = StorageService.labelBottom;
        var radius = StorageService.radius;
        

        $scope.pie = {};
        
        $scope.pie.options = {
            series : [
                {
                    type : 'pie', center : ['12.5', '50'], radius : radius, itemStyle : labelFromatter,
                    data : [
                        {name:'Bounce', value:36, itemStyle : labelTop},
                        {name:'other', value:64, itemStyle : labelBottom}
                    ]
                },{
                    type : 'pie', center : ['37.5', '50'], radius : radius, itemStyle : labelFromatter,
                    data : [
                        {name:'Activation', value:45, itemStyle : labelTop},
                        {name:'other', value:55, itemStyle : labelBottom}
                    ]
                },{
                    type : 'pie', center : ['62.5', '50'], radius : radius, itemStyle : labelFromatter,
                    data : [
                        {name:'Retention', value:25, itemStyle : labelTop},
                        {name:'other', value:75, itemStyle : labelBottom}
                    ]
                },{
                    type : 'pie', center : ['87.5', '50'], radius : radius, itemStyle : labelFromatter,
                    data : [
                        {name:'Referral', value:75, itemStyle : labelTop},
                        {name:'other', value:25, itemStyle : labelBottom}
                    ]
                }
            ]
        };        
    }


})(); 
