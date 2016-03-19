(function () {
    'use strict';

    angular.module('app.sidebar',['app.service','app.context','ngCookies'])
    .controller('sidebarCtrl', ['$scope', '$window', '$location', '$cookies', 'UserService', 'SchoolService', 'CourseService', 'SubjectService',
        'ScheduleService', 'SessionService', 'AuthService','ContextService', '$state','$stateParams', '$rootScope', sidebarCtrl]);
    
    function sidebarCtrl($scope, $window, $location, $cookies, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, AuthService, ContextService, $state, $stateParams, $rootScope) {
            //$scope.user = { id: '', email: '', firstname: '', lastname: '', school: '', phone: '', type: '' };
            $scope.user = $cookies.getObject('user');
            
            $scope.state = $state;
            $scope.params = $stateParams;
            $scope.hideOptions = true;
            
            
            $scope.items = [
                    {
                        name: 'Minha Conta',
                        route: '#/page/profile/' + $scope.user.id,
                        items: [
                            { name: 'Meu Perfil', route: '#/page/profile/' + $scope.user.id },
                            { name: 'Standby', route: '#/page/lock-screen' },
                            { name: 'Alterar Perfil', route: '#/page/edit-profile' }
                        ]
                    }
            ];

            $scope.roles = {
                admin: [
                    {
                        name: 'Minha Conta',
                        route: '#/page/profile/' + $scope.user.id,
                        items: [
                            { name: 'Meu Perfil', route: '#/page/profile/' + $scope.user.id },
                            { name: 'Criar Escola', route: '#/page/manager/new' },
                            { name: 'Ver Escolas', route: '#/page/school/list' }
                        ]
                    }
            
                    
                ],
                manager: [
                    {
                        name: 'Escola',
                        route: '#/page/school/profile/' + $scope.user.school,
                        items: [
                            { name: 'Meu Perfil', route: '#/page/profile/' + $scope.user.id },
                            { name: 'Perfil da Escola', route: '#/page/school/profile/' + $scope.user.school }
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
                        name: 'Escola',
                        route: '#/page/school/profile/' + $scope.user.school,
                        items: [
                            { name: 'Meu Perfil', route: '#/page/profile/' + $scope.user.id },
                            { name: 'Perfil da Escola', route: '#/page/school/profile/' + $scope.user.school },
                            { name: 'Começar Aula', route: '#/page/schedule/session/new/' + $scope.user.school + '/' + $scope.user.id },
                            { name: 'Horários', route: '#/page/professor/schedules/' + $scope.user.id },
                            //{ name: 'Faltas', route: '#/page/professor/absences/' + $scope.user.id },
                            { name: 'Cursos', route: '#/page/school/courses/' + $scope.user.school },
                            { name: 'Professores', route: '#/page/school/professors/' + $scope.user.id }
                        ]
                    }

                ]
            };

            $rootScope.$on("$stateChangeSuccess", function (event, currentRoute, previousRoute) {
                $scope.items = $scope.roles[$scope.user.type][0].items; 
                $scope.context = ContextService.items[currentRoute.name + '/:id'];

                    if(!!$scope.context){
                        $scope.hideOptions = false;
                    for (var i = 0; i < $scope.context.length; i++) {
                        var url = $scope.context[i].url.split('/');
                        console.log(url);
                        console.log($stateParams.id);
                            url.splice(url.length -1);
                            $scope.context[i].url = url.join('/') + '/'+$stateParams.id;
                            console.log($scope.context[i].url);
                    };
                }else{
                    $scope.context = [];
                    $scope.hideOptions = true;
                }
        });



            $scope.init =  function() {
                //console.log(AuthService.isAuthenticated());
                //console.log($scope.user);
                //console.log($location);
                
                //setTimeout(function(){ console.log($state.current);}, 1000);

                

                //console.log(path);
                //console.log(id);
                
                if(AuthService.isAuthenticated()){
                    $scope.user = $cookies.getObject('user');
                    
                    $scope.items = $scope.roles[$scope.user.type][0].items;
                    console.log($scope.items);
                }
            };

            //$state.current.name
            //$state.includes('stateName'); 
            //ng-class="{active: $state.includes('stateName')}"
        
    }


})(); 



