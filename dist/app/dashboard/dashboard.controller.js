(function () {
    'use strict';

    angular.module('app')
        .controller('adminDashboardCtrl', ['$scope', '$cookies', 'StorageService','StatsService',adminDashboardCtrl])
        .controller('managerDashboardCtrl', ['$scope', '$cookies', 'StorageService','StatsService',managerDashboardCtrl])
        .controller('professorDashboardCtrl', ['$scope', '$cookies', 'StorageService','StatsService',professorDashboardCtrl])
        .controller('studentDashboardCtrl', ['$scope', '$cookies', 'StorageService','StatsService',studentDashboardCtrl])
        .controller('DashboardCtrl', ['$scope', '$cookies', 'StorageService','StatsService',DashboardCtrl])

    function adminDashboardCtrl($scope, $cookies, StorageService, StatsService) {


        
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

    function managerDashboardCtrl($scope, $cookies, StorageService, StatsService) {
        var user = $cookies.getObject('user');
        var school = user.school;
        $scope.stats = [
            { name: 'CURSOS', icon: 'zmdi-puzzle-piece', value: StatsService.school_courses(school), unit: '', color: 'color-warning' },
            { name: 'DISCIPLINAS', icon: 'zmdi-library', value: StatsService.school_subjects(school), unit: '', color: 'color-danger' },
            { name: 'AULAS', icon: 'zmdi-edit', value: StatsService.school_sessions(school), unit: '', color: 'color-info' },
            { name: 'UTILIZADORES', icon: 'zmdi-local-airport', value: StatsService.school_users(school), unit: '', color: 'color-success' },
            { name: 'ESTUDANTES', icon: 'zmdi-graduation-cap', value: StatsService.school_students(school), unit: '', color: 'color-info' },
            { name: 'PROFESSORES', icon: 'zmdi-accounts-alt', value: StatsService.school_professors(school), unit: '', color: 'color-warning' },
            { name: 'FALTAS DE PROFESSORES', icon: 'zmdi-calendar-close', value: StatsService.school_professor_absences(school), unit: '', color: 'color-success' },
            { name: 'FALTAS DE ESTUDANTES', icon: 'zmdi-calendar-close', value: StatsService.school_student_absences(school), unit: '', color: 'color-success' }
        ];
    }

    function professorDashboardCtrl($scope, $cookies, StorageService, StatsService) {
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

    function studentDashboardCtrl($scope, $cookies, StorageService, StatsService) {
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

    function DashboardCtrl($scope, $cookies, StorageService, StatsService) {
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
