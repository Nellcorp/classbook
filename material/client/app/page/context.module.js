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
        {name: 'View All', url: 'page/admin/list'}
        ],
'page/course/profile/:id': [
        {name: 'View Subjects', url: 'page/course/subjects/'+id},
        {name: 'Add Subjects', url: 'page/course/subject/batch/'+id},
        {name: 'View Students', url: 'page/course/students/'+id},
        {name: 'View All Courses', url: 'page/school/courses/'+id}
        ],
'page/course/subjects/:id': [
        {name: 'View Course', url: 'page/course/profile/'+id},
        {name: 'Add Subject', url: 'page/course/subject/new/'+id},
        {name: 'Add Subjects', url: 'page/course/subject/batch/'+id},
        {name: 'Add Schedules', url: 'page/course/schedule/batch/'+id}
        ],
'page/course/students/:id': [
        {name: 'View Course', url: 'page/course/profile/'+id},
        {name: 'View Course Subjects', url: 'page/course/subjects/'+id},
        {name: 'View Course Schedules', url: 'page/course/schedules/'+id}
        ],
'page/manager/profile/:id': [
        //{name: 'View School', url: '/'}
        ],
'page/professor/profile/:id': [
        //{name: 'View School', url: '/'},
        {name: 'View Schedules', url: 'page/professor/schedules/'+id},
        //{name: 'View Absences', url: 'page/professor/absences/'+id}
        ],
'page/professor/schedules/:id': [
        {name: 'View professor', url: 'page/professor/profile/'+id}
        ],
'page/professor/absences/:id': [
        {name: 'View Professor', url: 'page/professor/profile/'+id}
        ],
'page/school/courses/:id': [
        {name: 'View School', url: 'page/school/profile/'+id},
        {name: 'Add Course', url: 'page/school/course/new/'+id},
        {name: 'Add Courses', url: 'page/school/course/batch/'+id}
        ],
'page/school/professors/:id': [
        {name: 'View School', url: 'page/school/profile/'+id},
        {name: 'Add Professor', url: 'page/school/professor/new/'+id},
        {name: 'Add Professors', url: 'page/school/professor/batch/'+id}
        ],
'page/school/profile/:id': [
        {name: 'View Courses', url: 'page/school/courses/'+id},
        {name: 'View Subjects', url: 'page/school/subjects/'+id},
        {name: 'View Students', url: 'page/school/students/'+id},
        {name: 'View Professors', url: 'page/school/professors/'+id},
        {name: 'Add Courses', url: 'page/school/course/batch/'+id},
        {name: 'Add Subjects', url: 'page/school/subject/batch/'+id},
        {name: 'Add Students', url: 'page/school/student/batch/'+id},
        {name: 'Add Professors', url: 'page/school/professor/batch/'+id}
        ],
'page/school/course/new/:id': [
        {name: 'View School', url: 'page/school/profile/'+id}
        ],
'page/school/course/batch/:id': [
        {name: 'View School', url: 'page/school/profile/'+id}
        ],
'page/school/subject/new/:id': [
        {name: 'View School', url: 'page/school/profile/'+id}
        ],
'page/school/subject/batch/:id': [
        {name: 'View School', url: 'page/school/profile/'+id}
        ],
'page/school/student/new/:id': [
        {name: 'View School', url: 'page/school/profile/'+id}
        ],
'page/school/student/batch/:id': [
        {name: 'View School', url: 'page/school/profile/'+id}
        ],
'page/school/professor/new/:id': [
        {name: 'View School', url: 'page/school/profile/'+id}
        ],
'page/school/professor/batch/:id': [
        {name: 'View School', url: 'page/school/profile/'+id}
        ],
'page/school/course/new/:id': [
        {name: 'View School', url: 'page/school/profile/'+id}
        ],
'page/subject/schedule/batch/:id': [
        {name: 'View Subject', url: 'page/subject/profile/'+id}
        ],
'page/subject/schedule/new/:id': [
        {name: 'View Subject', url: 'page/subject/profile/'+id}
        ],
'page/school/students/:id': [
        {name: 'View School', url: 'page/school/profile/'+id},
        {name: 'Add Student', url: 'page/school/student/new/'+id},
        {name: 'Add Students', url: 'page/school/student/batch/'+id}
        ],
'page/school/subjects/:id': [
        {name: 'View School', url: 'page/school/profile/'+id},
        {name: 'Add Subject', url: 'page/school/subject/new/'+id},
        {name: 'Add Subjects', url: 'page/school/subject/batch/'+id}
        ],
'page/session/profile/:id': [
        //{name: 'View Subject', url: '/'},
        //{name: 'View Schedule', url: '/'}
        ],
'page/student/profile/:id': [
        //{name: 'View Course', url: '/'},
        //{name: 'View Absences', url: '/'}
        ],
'page/student/absences/:id': [
        {name: 'View Student', url: 'page/student/profile/'+id}
        ],
'page/subject/profile/:id': [
        //{name: 'View Course', url: '/'},
        {name: 'View Schedules', url: 'page/subject/schedules/'+id},
        {name: 'View Students', url: 'page/subject/students/'+id},
        {name: 'View Sessions', url: 'page/subject/sessions/'+id},
        {name: 'Add Schedule', url: 'page/subject/schedule/new/'+id},
        {name: 'Add Schedules', url: 'page/subject/schedule/batch/'+id}
        ],
'page/subject/schedules/:id': [
        {name: 'View Subject', url: 'page/subject/profile/'+id},
        {name: 'Add Schedule', url: 'page/subject/schedule/new/'+id},
        {name: 'Add Schedules', url: 'page/subject/schedule/batch/'+id}
        ],
'page/subject/students/:id': [
        {name: 'View Subject', url: 'page/subject/profile/'+id}
        ],
'page/subject/sessions/:id': [
        {name: 'View Subject', url: 'page/subject/profile/'+id}
        ],
'page/schedule/sessions/:id': [
        {name: 'View Schedule', url: 'page/schedule/profile/'+id},
        {name: 'Add Session', url: 'page/session/profile/'+id}
        ],
'page/schedule/students/:id': [
        //{name: 'View Subject', url: '/'},
        {name: 'View Schedule', url: 'page/schedule/profile/'+id}
        ]
};

 contextService.items = items;
 return contextService;
		});
})(); 