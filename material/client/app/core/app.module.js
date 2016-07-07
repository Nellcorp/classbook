(function () {
    'use strict';

    angular.module('app', [
        // Core modules
         'app.core'
        
        // Custom Feature modules
        ,'app.chart'
        ,'app.ui'
        ,'app.ui.form'
        ,'app.ui.form.validation'
        ,'app.page'
        ,'app.delete'
        ,'app.manager'
        ,'app.student'
        ,'app.professor'
        ,'app.school'
        ,'app.course'
        ,'app.subject'
        ,'app.schedule'
        ,'app.session'
        ,'app.admin'
        ,'app.table'
        ,'app.service'
        ,'app.context'
        ,'app.sidebar'
        ,'app.header'
        
        // 3rd party feature modules
        ,'ui.tree'
        ,'ngMap'
        ,'textAngular'
        ,'ngResource'
        ,'ngCookies'
    ]);

})();