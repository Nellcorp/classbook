(function () {
    'use strict';

    angular.module('app.context', ['ngCookies'])
        .factory('ContextService', function ($resource, $cookies, $location, $state) {
  			var contextService = {};
        
        //var id = $state.params.id;
        var id = '';
        //var state = $state.current.name + '/:id';
        
        var items = {
'page/admin/profile/:id': [
        {name: 'All Admins', url: 'page/admin/list', roles: ['admin']}
        ],
'page/course/profile/:id': [
        {name: 'Ver Disciplinas', url: 'page/course/subjects/'+id, roles: ['manager','professor','admin']},
        {name: 'Adicionar Disciplinas', url: 'page/course/subject/batch/'+id, roles: ['manager']},
        {name: 'Ver Estudantes', url: 'page/course/students/'+id, roles: ['manager','professor']},
        {name: 'Ver todos os Cursos', url: 'page/school/courses/'+id, roles: ['manager','professor','admin']}
        ],
'page/course/subjects/:id': [
        {name: 'Ver Curso', url: 'page/course/profile/'+id, roles: ['manager','professor','admin']},
        {name: 'Adicionar Disciplina', url: 'page/course/subject/new/'+id, roles: ['manager']},
        {name: 'Adicionar Disciplinas', url: 'page/course/subject/batch/'+id, roles: ['manager']},
        {name: 'Adicionar Horários', url: 'page/course/schedule/batch/'+id, roles: ['manager']}
        ],
'page/course/students/:id': [
        {name: 'Ver Curso', url: 'page/course/profile/'+id, roles: ['manager','professor','admin']},
        {name: 'Ver Disciplinas', url: 'page/course/subjects/'+id, roles: ['manager','professor','admin']},
        {name: 'Ver Curso Horários', url: 'page/course/schedules/'+id, roles: ['manager','professor','admin']}
        ],
'page/manager/profile/:id': [
        //{name: 'Ver Escola', url: '/'}
        ],
'page/professor/profile/:id': [
        //{name: 'Ver Escola', url: '/'},
        {name: 'Ver Horários', url: 'page/professor/schedules/'+id, roles: ['manager','professor','admin']},
        //{name: 'Ver Absences', url: 'page/professor/absences/'+id}
        ],
'page/professor/schedules/:id': [
        {name: 'Ver professor', url: 'page/professor/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/professor/absences/:id': [
        {name: 'Ver Professor', url: 'page/professor/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/school/courses/:id': [
        {name: 'Ver Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']},
        {name: 'Adicionar Curso', url: 'page/school/course/new/'+id, roles: ['manager']},
        {name: 'Adicionar Cursos', url: 'page/school/course/batch/'+id, roles: ['manager']}
        ],
'page/school/professors/:id': [
        {name: 'Ver Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']},
        {name: 'Adicionar Professor', url: 'page/school/professor/new/'+id, roles: ['manager']},
        {name: 'Adicionar Professores', url: 'page/school/professor/batch/'+id, roles: ['manager']}
        ],
'page/school/profile/:id': [
        {name: 'Ver Cursos', url: 'page/school/courses/'+id, roles: ['manager','professor','admin']},
        {name: 'Ver Disciplinas', url: 'page/school/subjects/'+id, roles: ['manager','professor','admin']},
        {name: 'Ver Estudantes', url: 'page/school/students/'+id, roles: ['manager','professor','admin']},
        {name: 'Ver Professores', url: 'page/school/professors/'+id, roles: ['manager','professor','admin']},
        {name: 'Adicionar Cursos', url: 'page/school/course/batch/'+id, roles: ['manager']},
        {name: 'Adicionar Disciplinas', url: 'page/school/subject/batch/'+id, roles: ['manager']},
        {name: 'Adicionar Estudantes', url: 'page/school/student/batch/'+id, roles: ['manager']},
        {name: 'Adicionar Professores', url: 'page/school/professor/batch/'+id, roles: ['manager']}
        ],
'page/school/course/batch/:id': [
        {name: 'Ver Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/school/subject/new/:id': [
        {name: 'Ver Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/school/subject/batch/:id': [
        {name: 'Ver Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/school/student/new/:id': [
        {name: 'Ver Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/school/student/batch/:id': [
        {name: 'Ver Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/school/professor/new/:id': [
        {name: 'Ver Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/school/professor/batch/:id': [
        {name: 'Ver Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/school/course/new/:id': [
        {name: 'Ver Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/subject/schedule/batch/:id': [
        {name: 'Ver Disciplina', url: 'page/subject/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/subject/schedule/new/:id': [
        {name: 'Ver Disciplina', url: 'page/subject/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/school/students/:id': [
        {name: 'Ver Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']},
        {name: 'Adicionar Estudante', url: 'page/school/student/new/'+id, roles: ['manager']},
        {name: 'Adicionar Estudantes', url: 'page/school/student/batch/'+id, roles: ['manager']}
        ],
'page/school/subjects/:id': [
        {name: 'Ver Escola', url: 'page/school/profile/'+id, roles: ['manager','professor','admin']},
        {name: 'Adicionar Disciplina', url: 'page/school/subject/new/'+id, roles: ['manager']},
        {name: 'Adicionar Disciplinas', url: 'page/school/subject/batch/'+id, roles: ['manager']}
        ],
'page/session/profile/:id': [
        //{name: 'Ver Disciplina', url: '/'},
        //{name: 'Ver Horário', url: '/'}
        ],
'page/student/profile/:id': [
        //{name: 'Ver Curso', url: '/'},
        //{name: 'Ver Absences', url: '/'}
        ],
'page/student/absences/:id': [
        {name: 'Ver Estudante', url: 'page/student/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/subject/profile/:id': [
        //{name: 'Ver Curso', url: '/'},
        {name: 'Ver Horários', url: 'page/subject/schedules/'+id, roles: ['manager','professor','admin']},
        {name: 'Ver Estudantes', url: 'page/subject/students/'+id, roles: ['manager','professor','admin']},
        {name: 'Ver Sessions', url: 'page/subject/sessions/'+id, roles: ['manager','professor','admin']},
        {name: 'Adicionar Horário', url: 'page/subject/schedule/new/'+id, roles: ['manager']},
        {name: 'Adicionar Horários', url: 'page/subject/schedule/batch/'+id, roles: ['manager']}
        ],
'page/subject/schedules/:id': [
        {name: 'Ver Disciplina', url: 'page/subject/profile/'+id},
        {name: 'Adicionar Horário', url: 'page/subject/schedule/new/'+id, roles: ['manager']},
        {name: 'Adicionar Horários', url: 'page/subject/schedule/batch/'+id, roles: ['manager']}
        ],
'page/subject/students/:id': [
        {name: 'Ver Disciplina', url: 'page/subject/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/subject/sessions/:id': [
        {name: 'Ver Disciplina', url: 'page/subject/profile/'+id, roles: ['manager','professor','admin']}
        ],
'page/schedule/sessions/:id': [
        {name: 'Ver Horário', url: 'page/schedule/profile/'+id, roles: ['manager','professor','admin']}
        //{name: 'Adicionar Session', url: 'page/session/profile/'+id}
        ],
'page/schedule/students/:id': [
        //{name: 'Ver Disciplina', url: '/'},
        {name: 'Ver Horário', url: 'page/schedule/profile/'+id, roles: ['manager','professor','admin']}
        ]
};

 contextService.items = items;
 return contextService;
		});
})(); 