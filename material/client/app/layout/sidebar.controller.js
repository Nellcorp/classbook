(function () {
    'use strict';

    angular.module('app.sidebar',['app.service','ngCookies'])
    .controller('sidebarCtrl', ['$scope', '$window', '$location', '$cookies', 'UserService', 'SchoolService', 'CourseService', 'SubjectService',
        'ScheduleService', 'SessionService', 'AuthService', '$state','$stateParams', sidebarCtrl]);
    
    function sidebarCtrl($scope, $window, $location, $cookies, UserService, SchoolService, CourseService, SubjectService, ScheduleService, SessionService, AuthService, $state, $stateParams) {
            console.log($cookies.get('auth'));
            $scope.user = $cookies.getObject('user');
            $scope.auth = $cookies.get('auth');
            $scope.state = $state;
            $scope.params = $stateParams;
            
            $scope.items = [
                    {
                        name: 'Conta',
                        items: [
                            { name: 'Standby', route: '#/page/lock-screen' },
                            { name: 'Alterar Perfil', route: '#/page/edit-profile' }
                        ]
                    }
            ];

            $scope.roles = {
                admin: [
                    {
                        name: 'Administração',
                        items: [
                            { name: 'Criar Escola', route: '#/page/manager/new' },
                            { name: 'Ver Escolas', route: '#/page/school/list' }
                        ]
                    }
            
                    
                ],
                manager: [
                    {
                        name: 'Escola',
                        items: [
                            { name: 'Perfil da Escola', route: '#/page/school/profile/' + $scope.user.school }
                        ]
                    },
                    {
                        name: 'Cursos',
                        items: [
                            { name: 'Cursos', route: '#/page/school/courses/' + $scope.user.school },
                            { name: 'Adiconar Curso', route: '#/page/school/course/new/' + $scope.user.school },
                            { name: 'Adicionar Cursos', route: '#/page/school/course/batch/' + $scope.user.school }
                        ]
                    },
                    {
                        name: 'Disciplinas',
                        items: [
                            { name: 'Disciplinas', route: '#/page/school/subjects/' + $scope.user.school },
                            { name: 'Adicionar Disciplina', route: '#/page/school/subject/new/' + $scope.user.school },
                            { name: 'Adicionar Disciplinas', route: '#/page/school/subject/batch/' + $scope.user.school }
                        ]
                    },
                    {
                        name: 'Professores',
                        items: [
                            { name: 'Professores', route: '#/page/school/professors/' + $scope.user.school },
                            { name: 'Adicionar Professor', route: '#/page/school/professor/new/' + $scope.user.school },
                            { name: 'Adicionar Professores', route: '#/page/school/professor/batch/' + $scope.user.school }
                        ]
                    },
                    {
                        name: 'Estudantes',
                        items: [
                            { name: 'Estudantes', route: '#/page/school/students/' + $scope.user.school },
                            { name: 'Adicionar Estudante', route: '#/page/school/student/new/' + $scope.user.school },
                            { name: 'Adicionar Estudantes', route: '#/page/school/student/batch/' + $scope.user.school }
                        ]
                    },
                ],
                professor: [
                    {
                        name: 'Menu',
                        items: [
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

            $scope.init =  function() {
                if(!!$cookies.get('auth')){
                    $scope.items = $scope.roles[$scope.user.type];
                }
            };

            //$state.current.name
            //$state.includes('stateName'); 
            //ng-class="{active: $state.includes('stateName')}"
        
    }


})(); 



