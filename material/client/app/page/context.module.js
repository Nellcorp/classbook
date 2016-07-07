(function () {
    'use strict';

    angular.module('app.context', ['ngCookies'])
        .factory('ContextService', [ "$resource", "$cookies", "$location", "$state", function ($resource, $cookies, $location, $state) {
  			var contextService = {};
            
        //var id = $state.params.id;
        var id = '';
        //var state = $state.current.name + '/:id';
        
        var items = {
'page/admin/profile/:id': [
        {name: 'All Admins', url: 'page/admin/list', roles: ['admin']},
        {name: 'Eliminar Administrador', url: 'page/user/delete/'+id, roles: ['admin']}
        ],
'page/course/profile/:id': [
        {name: 'Disciplinas', url: 'page/course/subjects/'+id, roles: ['manager','professor','admin']},
        {name: 'Estudantes', url: 'page/course/students/'+id, roles: ['manager','professor']},
        {name: 'todos os Cursos', url: 'page/school/courses/'+id, roles: ['manager','professor','admin']},
        //{name: 'Adicionar Horários', url: 'page/course/schedule/batch/'+id, roles: ['manager','professor','admin']},
        {name: 'Eliminar Curso', url: 'page/course/delete/'+id, roles: ['admin','manager']},
        {name: 'Eliminar Disciplinas', url: 'page/course/subject/delete/'+id, roles: ['manager']},
        {name: 'Eliminar Estudantes', url: 'page/course/student/delete/'+id, roles: ['manager']}
        ],
'page/course/subjects/:id': [
        {name: 'Curso', url: 'page/course/profile/'+id, roles: ['manager','professor','admin']},
        {name: 'Eliminar Disciplinas', url: 'page/course/subject/delete/'+id, roles: ['manager']}
        ],
'page/course/students/:id': [
        {name: 'Curso', url: 'page/course/profile/'+id, roles: ['manager','professor','admin']},
        {name: 'Disciplinas', url: 'page/course/subjects/'+id, roles: ['manager','professor','admin']},
        {name: 'Horários', url: 'page/course/schedules/'+id, roles: ['manager','professor','admin']},
        {name: 'Eliminar Estudantes', url: 'page/course/student/delete/'+id, roles: ['manager']}
        ],
'page/manager/profile/:id': [
        //{name: 'Escola', url: '/'}
        {name: 'Eliminar Escola', url: 'page/user/delete/'+id, roles: ['admin','manager']}
        ],
'page/professor/profile/:id': [
        //{name: 'Escola', url: '/'},
        {name: 'Horários', url: 'page/professor/schedules/'+id, roles: ['manager','professor','admin']},
        {name: 'Eliminar Professor', url: 'page/user/delete/'+id, roles: ['manager']},
        {name: 'Eliminar Horários', url: 'page/professor/schedule/delete/'+id, roles: ['manager']}
        //{name: 'Absences', url: 'page/professor/absences/'+id}
        ],
'page/professor/schedules/:id': [
        {name: 'professor', url: 'page/professor/profile/'+id, roles: ['manager','professor','admin']},
        {name: 'Eliminar Horários', url: 'page/professor/schedule/delete/'+id, roles: ['manager']}
        ],
'page/professor/absences/:id': [
        {name: 'Professor', url: 'page/professor/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/school/courses/:id': [
        //{name: 'Adicionar Cursos', url: 'page/school/course/batch/'+id, roles: ['manager']},
        {name: 'Eliminar Cursos', url: 'page/school/course/delete/'+id, roles: ['manager']}
        ],
'page/school/professors/:id': [
        //{name: 'Adicionar Professores', url: 'page/school/professor/batch/'+id, roles: ['manager']},
        {name: 'Eliminar Professores', url: 'page/school/professor/delete/'+id, roles: ['manager']}
        ],
'page/school/profile/:id': [
        {name: 'Cursos', url: 'page/school/courses/'+id, roles: ['manager','professor','admin']},
        {name: 'Disciplinas', url: 'page/school/subjects/'+id, roles: ['manager','professor','admin']},
        {name: 'Estudantes', url: 'page/school/students/'+id, roles: ['manager','professor','admin']},
        {name: 'Professores', url: 'page/school/professors/'+id, roles: ['manager','professor','admin']},
        {name: 'Horários', url: 'page/school/schedules/'+id, roles: ['manager','professor','admin']},
        {name: 'Importar Conteúdo', url: 'page/import', roles: ['manager']},
        //{name: 'Adicionar Cursos', url: 'page/school/course/batch/'+id, roles: ['manager']},
        //{name: 'Adicionar Disciplinas', url: 'page/school/subject/batch/'+id, roles: ['manager']},
        //{name: 'Adicionar Professores', url: 'page/school/professor/batch/'+id, roles: ['manager']},
        //{name: 'Adicionar Horários', url: 'page/school/schedule/batch/'+id, roles: ['manager']},
        //{name: 'Adicionar Estudantes', url: 'page/school/student/batch/'+id, roles: ['manager']},
        //{name: 'Eliminar Cursos', url: 'page/school/course/delete/'+id, roles: ['admin','manager']},
        //{name: 'Eliminar Professores', url: 'page/school/professor/delete/'+id, roles: ['admin','manager']},
        //{name: 'Eliminar Estudantes', url: 'page/school/student/delete/'+id, roles: ['admin','manager']},
        //{name: 'Eliminar Disciplinas', url: 'page/school/subject/delete/'+id, roles: ['admin','manager']},
        //{name: 'Eliminar Horários', url: 'page/school/schedule/delete/'+id, roles: ['admin','manager']},
        {name: 'Eliminar Escola', url: 'page/school/delete/'+id, roles: ['admin']}
        ],
'page/school/schedules/:id': [
        {name: 'Eliminar Horários', url: 'page/school/schedule/delete/'+id, roles: ['admin','manager']}
        ],
'page/school/course/batch/:id': [
        //{name: 'Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/school/subject/new/:id': [
        //{name: 'Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/school/subject/batch/:id': [
        //{name: 'Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/school/student/new/:id': [
        //{name: 'Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/school/student/batch/:id': [
        //{name: 'Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/school/professor/new/:id': [
        //{name: 'Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/school/professor/batch/:id': [
        //{name: 'Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/school/course/new/:id': [
        //{name: 'Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/subject/schedule/batch/:id': [
        {name: 'Disciplina', url: 'page/subject/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/subject/schedule/new/:id': [
        {name: 'Disciplina', url: 'page/subject/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/school/students/:id': [
        //{name: 'Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']},
        //{name: 'Adicionar Estudantes', url: 'page/school/student/batch/'+id, roles: ['manager']},
        {name: 'Eliminar Estudantes', url: 'page/school/student/delete/'+id, roles: ['manager']}
        ],
'page/school/subjects/:id': [
        //{name: 'Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']},
        //{name: 'Adicionar Disciplinas', url: 'page/school/subject/batch/'+id, roles: ['manager']},
        {name: 'Eliminar Disciplinas', url: 'page/school/subject/delete/'+id, roles: ['manager']}
        ],
'page/session/profile/:id': [
        //{name: 'Disciplina', url: '/'},
        //{name: 'Horário', url: '/'}
        ],
'page/student/profile/:id': [
        {name: 'Eliminar Estudante', url: 'page/user/delete/'+id, roles: ['manager']}
        //{name: 'Curso', url: '/'},
        //{name: 'Absences', url: '/'}
        ],
'page/student/absences/:id': [
        {name: 'Estudante', url: 'page/student/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/subject/profile/:id': [
        //{name: 'Curso', url: '/'},
        {name: 'Horários', url: 'page/subject/schedules/'+id, roles: ['manager','professor','admin']},
        {name: 'Estudantes', url: 'page/subject/students/'+id, roles: ['manager','professor','admin']},
        {name: 'Sessions', url: 'page/subject/sessions/'+id, roles: ['manager','professor','admin']},
        {name: 'Eliminar Disciplina', url: 'page/subject/delete/'+id, roles: ['manager']},
        {name: 'Eliminar Horários', url: 'page/subject/schedule/delete/'+id, roles: ['manager']}
        ],
'page/subject/schedules/:id': [
        {name: 'Disciplina', url: 'page/subject/profile/'+id,roles: ['admin','manager','professor']},
        {name: 'Eliminar Horários', url: 'page/subject/schedule/delete/'+id, roles: ['manager']}
        ],
'page/subject/students/:id': [
        {name: 'Disciplina', url: 'page/subject/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/subject/sessions/:id': [
        {name: 'Disciplina', url: 'page/subject/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/schedule/sessions/:id': [
        {name: 'Horário', url: 'page/schedule/profile/'+id, roles: ['manager','professor','admin']}
        //{name: 'Adicionar Session', url: 'page/session/profile/'+id}
        ],
'page/schedule/students/:id': [
        //{name: 'Disciplina', url: '/'},
        {name: 'Horário', url: 'page/schedule/profile/'+id, roles: ['manager','professor','admin']}
        ]
};

 contextService.items = items;
 return contextService;
		}]);
})(); 