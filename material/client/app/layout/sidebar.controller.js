(function () {
    'use strict';

    angular.module('app.sidebar',['app.service','app.context','ngCookies'])
    .controller('sidebarCtrl', ['$scope','$timeout', '$window', '$location', '$cookies', 'UserService', 'SchoolService', 'CourseService', 'SubjectService',
        'ScheduleService', 'SessionService', 'AuthService','ContextService', '$state','$stateParams', '$rootScope', sidebarCtrl]);
    
    function sidebarCtrl($scope, $timeout, $window, $location, $cookies, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, AuthService, ContextService, $state, $stateParams, $rootScope) {
            
                $timeout(function() {
                    //console.log('sidebar ctrl',$cookies.getObject('user'));
                    $scope.user = $cookies.getObject('user');
                
                var init_route = { name: 'Ver Escolas', route: '#/page/school/list' }
                if($scope.user.type != 'admin'){
                    init_route = { name: 'Minha Escola', route: '#/page/school/profile/' + $scope.user.school };
                }

            $scope.items = [
                { name: 'Painel', route: '#/page/profile/' + $scope.user.type },
                init_route
                //{ name: 'Meu Perfil', route: '#/page/profile/' + $scope.user.id }//,
            ];

            console.log('Items',$scope.items);

        $rootScope.$on("$stateChangeSuccess", function (event, currentRoute, previousRoute) {
                console.log('success on sidebar');
                $scope.user = $cookies.getObject('user');

                $scope.name = $scope.user.firstname.substring(0, 1).toUpperCase() + $scope.user.firstname.substring(1) +
                ' ' + $scope.user.lastname.substring(0, 1).toUpperCase() + $scope.user.lastname.substring(1);

                
            //console.log('user here', $scope.user);
            $scope.state = $state;
            $scope.params = $stateParams;
            //$scope.hideOptions = true;
            $scope.hideOptions = false;
            
            //if(!$scope.user){
            //$scope.items = [];
            //$scope.roles = {};
            //}
            //else{

                $scope.roles = {
                admin: [
                    {
                        name: 'Início',
                        route: '#/page/profile/admin',
                        items: [
                            { name: 'Painel', route: '#/page/profile/' + $scope.user.type},
                            { name: 'Criar Escola', route: '#/page/manager/new' },
                            { name: 'Ver Escolas', route: '#/page/school/list' }
                        ]
                    }
            
                    
                ],
                manager: [
                    {
                        name: 'Início',
                        route: '#/page/profile/' + $scope.user.type,
                        items: [
                            { name: 'Painel', route: '#/page/profile/' + $scope.user.type},
                            { name: 'Minha Escola', route: '#/page/school/profile/' + $scope.user.school }
                        ]
                    },
                    {
                        name: 'Cursos',
                        route: '#/page/school/courses/' + $scope.user.school,
                        items: [
                            { name: 'Cursos', route: '#/page/school/courses/' + $scope.user.school },
                            { name: 'Adiconar Curso', route: '#/page/school/course/new/' + $scope.user.school },
                            { name: 'Adicionar Cursos', route: '#/page/school/course/batch/' + $scope.user.school }
                        ]
                    },
                    {
                        name: 'Disciplinas',
                        route: '#/page/school/subjects/' + $scope.user.school,
                        items: [
                            { name: 'Disciplinas', route: '#/page/school/subjects/' + $scope.user.school },
                            { name: 'Adicionar Disciplina', route: '#/page/school/subject/new/' + $scope.user.school },
                            { name: 'Adicionar Disciplinas', route: '#/page/school/subject/batch/' + $scope.user.school }
                        ]
                    },
                    {
                        name: 'Professores',
                        route: '#/page/school/professors/' + $scope.user.school,
                        items: [
                            { name: 'Professores', route: '#/page/school/professors/' + $scope.user.school },
                            { name: 'Adicionar Professor', route: '#/page/school/professor/new/' + $scope.user.school },
                            { name: 'Adicionar Professores', route: '#/page/school/professor/batch/' + $scope.user.school }
                        ]
                    },
                    {
                        name: 'Estudantes',
                        route: '#/page/school/students/' + $scope.user.school,
                        items: [
                            { name: 'Estudantes', route: '#/page/school/students/' + $scope.user.school },
                            { name: 'Adicionar Estudante', route: '#/page/school/student/new/' + $scope.user.school },
                            { name: 'Adicionar Estudantes', route: '#/page/school/student/batch/' + $scope.user.school }
                        ]
                    },
                ],
                professor: [
                    {
                        name: 'Início',
                        route: '#/page/profile/' + $scope.user.type,
                        items: [
                            { name: 'Painel', route: '#/page/profile/' + $scope.user.type},
                            { name: 'Minha Escola', route: '#/page/school/profile/' + $scope.user.school },
                            //{ name: 'Começar Aula', route: '#/page/schedule/session/new/' + $scope.user.school + '/' + $scope.user.id },
                            //{ name: 'Horários', route: '#/page/professor/schedules/' + $scope.user.id },
                            //{ name: 'Faltas', route: '#/page/professor/absences/' + $scope.user.id },
                            { name: 'Cursos', route: '#/page/school/courses/' + $scope.user.school },
                            { name: 'Professores', route: '#/page/school/professors/' + $scope.user.school }
                        ]
                    }

                ]
            };

            if(AuthService.isAuthenticated()){
                    //$scope.user = $cookies.getObject('user');
                    if(!!$scope.user && ['admin','student','professor'].indexOf($scope.user.type) > -1){
                        $scope.items = $scope.roles[$scope.user.type][0].items;
                        //console.log($scope.items);
                    }
                    
                }            

                if(!!$scope.user && ['admin','student','professor','manager'].indexOf($scope.user.type) > -1){
                        $scope.items = $scope.roles[$scope.user.type][0].items; 
                        //console.log('manager',$scope.user.type);
                        //console.log('Items',$scope.items);
                    }
                
                $scope.context = ContextService.items[currentRoute.name + '/:id'];

                var no_id = ['page/import'];

                //console.log('After Change Route',currentRoute.name + '/:id');
                    if(!!$scope.context){
                        //console.log('After Change Success',$cookies.getObject('user').type,$scope.context);
                        $scope.hideOptions = false;
                        
                        var skip = [];
                    
                        for ( var i = 0; i < $scope.context.length; i++) {
                            if($scope.context[i].roles.indexOf($scope.user.type) > -1){
                                var url = $scope.context[i].url.split('/');
                                url.splice(url.length -1);

                                if(no_id.indexOf($scope.context[i].url) == -1){
                                    $scope.context[i].url = url.join('/') + '/'+$stateParams.id;
                                }
                                
                            }else{
                                $scope.context[i] = false;
                            }

                        }
                        $scope.context = $scope.context.filter( Boolean );
                        //console.log($scope.context);

                        if($scope.context.length == 0){
                                $scope.context = [];
                                $scope.hideOptions = true;
                            }
                        
                }else{
                    //console.log('After Change, Else',$cookies.getObject('user').type,$scope.context);
                    $scope.context = [];
                    $scope.hideOptions = true;
                }
                //console.log('After Change',$cookies.getObject('user').type,$scope.context);
        });
    }, 3000);



            //$state.current.name
            //$state.includes('stateName'); 
            //ng-class="{active: $state.includes('stateName')}"
        
    }


})(); 



