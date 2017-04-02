(function() {
    'use strict';

    angular.module('app.service')
        .factory("ValidationService", [

            function() {
                var validate = {};
                var email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                var phone = /^\d{9}$/;
                var school = /^[0-9a-fA-F]{24}$/;
                var time = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

                validate.validate_data = function(type, data, line, keys, existing, unique) {
                    existing = (typeof existing === 'undefined') ? {} : existing;
                    unique = (typeof unique === 'undefined') ? 'gibberish' : unique;

                    var row = line + 2;

                    var fields = Object.keys(data);
                    var schedule_days = ['segunda1', 'segunda2', 'terca1', 'terca2', 'quarta1', 'quarta2', 'quinta1', 'quinta2', 'sexta1', 'sexta2'];
                    var semesters = ['1', '2', 'anual'];

                    var result = {
                        status: false,
                        message: '',
                        type: type,
                        data: data
                    };

                    if (typeof data === 'undefined' || typeof line === 'undefined') {
                        result.message = type.toUpperCase() + ': campo inexistente ou vazio na linha' + row + ', coluna ' + keys[j];
                        return result;
                    }

                    var fallback = {
                        horarios_segunda1: '0:00',
                        horarios_segunda2: '0:00',
                        horarios_terca1: '0:00',
                        horarios_terca2: '0:00',
                        horarios_quarta1: '0:00',
                        horarios_quarta2: '0:00',
                        horarios_quinta1: '0:00',
                        horarios_quinta2: '0:00',
                        horarios_sexta1: '0:00',
                        horarios_sexta2: '0:00'
                    };
                    var fixed = data;

                    for (var j = 0; j < keys.length; j++) {

                        if (fields.indexOf(keys[j]) == -1 || !data[keys[j]]) {
                            var name = type + '_' + keys[j];

                            //Convert empty schedule times with 0:00
                            if (fallback.hasOwnProperty(name)) {
                                fixed[keys[j]] = fallback[name];
                            } else {
                                result.message = type.toUpperCase() + ': campo inexistente ou vazio na linha' + row + ', coluna ' + keys[j];
                                return result;
                            }

                        }

                        if (keys[j] == 'telefone' && !phone.test(data[keys[j]])) {
                            result.message = type.toUpperCase() + ': campo inválido na linha' + row + ', coluna ' + keys[j];
                            return result;

                        }
                        if (keys[j] == 'telefone_professor' && !phone.test(data[keys[j]])) {
                            result.message = type.toUpperCase() + ': campo inválido na linha' + row + ', coluna ' + keys[j];
                            return result;
                        }
                        if (keys[j] == 'telefone_encarregado' && !phone.test(data[keys[j]])) {
                            result.message = type.toUpperCase() + ': campo inválido na linha' + row + ', coluna ' + keys[j];
                            return result;
                        }
                        if (keys[j] == 'email_encarregado' && !email.test(data[keys[j]])) {
                            result.message = type.toUpperCase() + ': campo inválido na linha' + row + ', coluna ' + keys[j];
                            return result;
                        }
                        if (keys[j] == 'email' && !email.test(data[keys[j]])) {
                            result.message = type.toUpperCase() + ': campo inválido na linha' + row + ', coluna ' + keys[j];
                            return result;
                        }
                        if (keys[j] == 'time' && !time.test(data[keys[j]])) {
                            result.message = type.toUpperCase() + ': campo inválido na linha' + row + ', coluna ' + keys[j];
                            return result;
                        }

                        if (keys[j] == 'ano' && (data[keys[j]] < 1 || data[keys[j]] > 5)) {
                            result.message = type.toUpperCase() + ': campo inválido na linha' + row + ', coluna ' + keys[j] + ' - use apenas anos de 1 a 5';
                            return result;
                        }

                        if (keys[j] == 'semestre' && semesters.indexOf(data[keys[j]]) == -1) {
                            result.message = type.toUpperCase() + ': campo inválido na linha' + row + ', coluna ' + keys[j] + ' - use semestres 1, 2 ou anual';
                            return result;
                        }

                    }

                    if (type == 'horarios') {
                        //console.log('unique: ', unique);
                        //console.log('data: ', fixed);
                        //console.log('existing: ', existing);
                        //temp_schedule.course + '_' + temp_schedule.subject + '_' + temp_schedule.professor]
                    }
                    if (existing.hasOwnProperty(unique)) {
                        result.message = type.toUpperCase() + ': Item duplicado na linha ' + row + '. Verifique se já existe na base de dados ou no documento.';
                        return result;
                    }

                    result.message = 'success';
                    result.status = true;
                    result.data = fixed;
                    return result;
                };

                validate.courses = function(data, existing, school) {
                    var result = {
                        status: true,
                        messages: [],
                        passed: {},
                        data: [],
                        failed: []
                    };

                    var keys = ['curso', 'nome', 'apelido', 'email', 'telefone', 'descricao'];

                    for (var i = 0; i < data.length; i++) {
                        var temp = data[i];
                        var fields = Object.keys(temp);

                        var validate_data = validate.validate_data('cursos', temp, i, keys, existing, temp.curso);
                        if (validate_data.status === false) {
                            result.status = false;
                            result.failed.push(validate_data);
                            result.messages.push(validate_data.message);
                            continue;
                        }

                        temp = validate_data.data;

                        result.passed[temp.curso] = {
                            name: temp.curso,
                            school: school._id,
                            description: temp.descricao,
                            supervisor: {
                                firstname: temp.nome,
                                lastname: temp.apelido,
                                email: temp.email,
                                phone: temp.telefone
                            }
                        };
                    }
                    result.data = Object.keys(result.passed).map(function(k) {
                        return result.passed[k];
                    });
                    return result;
                };

                validate.groups = function(data, existing, school) {
                    var result = {
                        status: true,
                        messages: [],
                        passed: {},
                        data: [],
                        failed: []
                    };

                    var keys = ['nome'];

                    for (var i = 0; i < data.length; i++) {
                        var temp = data[i];
                        var fields = Object.keys(temp);

                        var validate_data = validate.validate_data('turmas', temp, i, keys, existing, temp.nome);

                        if (validate_data.status === false) {
                            result.status = false;
                            result.failed.push(validate_data);
                            result.messages.push(validate_data.message);
                            continue;
                        }

                        temp = validate_data.data;

                        result.passed[temp.nome] = {
                            name: temp.nome,
                            school: school._id
                        };
                        result.data.push(result.passed[temp.nome]);
                    }
                    result.data = Object.keys(result.passed).map(function(k) {
                        return result.passed[k];
                    });
                    return result;
                };

                validate.subjects = function(data, existing, school, courses, existing_courses) {
                    var result = {
                        status: true,
                        messages: [],
                        passed: {},
                        data: [],
                        failed: []
                    };

                    var keys = ['disciplina', 'curso', 'ano', 'semestre', 'descricao'];
                    var terms = ['1', '2', 'anual'];

                    for (var i = 0; i < data.length; i++) {
                        var temp = data[i];
                        var fields = Object.keys(temp);
                        var term = {};

                        var validate_data = validate.validate_data('disciplinas', temp, i, keys, existing, temp.curso + '_' + temp.disciplina);

                        if (validate_data.status === false) {
                            result.status = false;
                            result.failed.push(validate_data);
                            result.messages.push(validate_data.message);
                            continue;
                        }

                        temp = validate_data.data;

                        //Ensure course exists
                        if (!existing_courses.hasOwnProperty(temp.curso) && !courses.hasOwnProperty(temp.curso)) {
                            result.status = false;
                            result.failed.push(temp);
                            result.messages.push('Erro na disciplina de ' + temp.disciplina + ': o curso de ' + temp.curso + ' não existe');
                            continue;
                        }

                        //Configure term
                        if (temp.semestre == '1') {
                            term = {
                                name: 'first',
                                start: school.semesters.first.start,
                                end: school.semesters.first.end
                            };
                        } else if (temp.semestre == '2') {
                            term = {
                                name: 'second',
                                start: school.semesters.second.start,
                                end: school.semesters.second.end
                            };
                        } else if (temp.semestre == 'anual') {
                            term = {
                                name: 'year',
                                start: school.semesters.first.start,
                                end: school.semesters.second.end
                            };
                        } else {
                            result.status = false;
                            result.failed.push(temp);
                            result.messages.push('Erro na disciplina de ' + temp.disciplina + ': use semestres 1, 2 ou anual');
                            continue;
                        }

                        result.passed[temp.curso + '_' + temp.disciplina] = {
                            name: temp.disciplina,
                            school: school._id,
                            description: temp.descricao,
                            year: temp.ano,
                            semester: term,
                            course: temp.curso.toLowerCase()
                        };

                        if (existing_courses.hasOwnProperty(temp.curso)) {
                            result.passed[temp.curso + '_' + temp.disciplina].course_id = existing_courses.temp.curso._id;
                        }

                        result.data.push(result.passed[temp.curso + '_' + temp.disciplina]);
                    }

                    //console.log('validated subjects', data[data]);
                    result.data = Object.keys(result.passed).map(function(k) {
                        return result.passed[k];
                    });
                    return result;
                };

                validate.schedules = function(data, existing, school, courses, existing_courses, subjects, existing_subjects, professors, existing_users, groups, existing_groups) {
                    var result = {
                        status: true,
                        messages: [],
                        passed: {},
                        data: [],
                        failed: []
                    };

                    var keys = ['curso', 'turma', 'disciplina', 'telefone_professor', 'segunda1', 'segunda2', 'terca1', 'terca2', 'quarta1', 'quarta2', 'quinta1', 'quinta2', 'sexta1', 'sexta2'];


                    //temp => course,subject,phone,08:00,10:00,00:00,00:00,08:00,10:00,08:00,10:00,08:00,10:00
                    for (var i = 0; i < data.length; i++) {
                        var temp = data[i];
                        var fields = Object.keys(temp);
                        var subject = {};
                        var course = {};
                        var group = {};
                        var professor = {};

                        //console.log('schedule', temp);

                        var validate_data = validate.validate_data('horarios', temp, i, keys, existing, temp.curso + '_' + temp.disciplina + '_' + temp.telefone_professor);

                        if (validate_data.status === false) {
                            result.status = false;
                            result.failed.push(validate_data);
                            result.messages.push(validate_data.message);
                            continue;
                        }

                        temp = validate_data.data;

                        //Ensure professor exists
                        if (existing_users.hasOwnProperty(temp.telefone_professor)) {
                            professor = existing_users[temp.telefone_professor];
                        } else if (professors.hasOwnProperty(temp.telefone_professor)) {
                            professor = professors[temp.telefone_professor];
                        } else {
                            result.status = false;
                            result.failed.push(temp);
                            result.messages.push('Erro (Horários): não existe nenhum professor com o telefone ' + temp.telefone_professor);
                            continue;
                        }

                        //console.log('validated schedule professor', temp);

                        //Ensure subject
                        if (existing_subjects.hasOwnProperty(temp.curso + '_' + temp.disciplina)) {
                            subject = existing_subjects[temp.curso + '_' + temp.disciplina];
                        } else if (subjects.hasOwnProperty(temp.curso + '_' + temp.disciplina)) {
                            subject = subjects[temp.curso + '_' + temp.disciplina];
                        } else {
                            result.status = false;
                            result.failed.push(temp);
                            result.messages.push('Erro (Horários): não existe nenhuma disciplina chamada ' + temp.disciplina);
                            continue;
                        }



                        //Ensure course
                        if (existing_courses.hasOwnProperty(temp.curso)) {
                            course = existing_courses[temp.curso];
                        } else if (courses.hasOwnProperty(temp.curso)) {
                            course = courses[temp.curso];
                        } else {
                            result.status = false;
                            result.failed.push(temp);
                            result.messages.push('Erro (Horários): não existe nenhum curso chamado ' + temp.curso);
                            continue;
                        }

                        //Ensure group
                        if (existing_groups.hasOwnProperty(temp.turma)) {
                            group = existing_groups[temp.turma];
                        } else if (courses.hasOwnProperty(temp.curso)) {
                            group = groups[temp.turma];
                        } else {
                            result.status = false;
                            result.failed.push(temp);
                            result.messages.push('Erro (Horários): não existe nenhuma turma chamada ' + temp.turma);
                            continue;
                        }

                        var temp_schedule = {
                            subject: temp.disciplina.toLowerCase(),
                            professor: temp.telefone_professor,
                            school: school._id,
                            group: temp.turma.toLowerCase(),
                            course: temp.curso.toLowerCase(),
                            absences: [],
                            schedule: {
                                monday: {
                                    start: temp.segunda1,
                                    end: temp.segunda2
                                },
                                tuesday: {
                                    start: temp.terca1,
                                    end: temp.terca2
                                },
                                wednesday: {
                                    start: temp.quarta1,
                                    end: temp.quarta2
                                },
                                thursday: {
                                    start: temp.quinta1,
                                    end: temp.quinta2
                                },
                                friday: {
                                    start: temp.sexta1,
                                    end: temp.sexta2
                                }
                            }
                        };

                        if (existing_users.hasOwnProperty(temp.telefone_professor)) {
                            temp_schedule.professor_id = existing_users[temp.telefone_professor]._id;
                        }
                        if (existing_subjects.hasOwnProperty(temp.curso + '_' + temp.disciplina)) {
                            temp_schedule.subject_id = existing_subjects[temp.curso + '_' + temp.disciplina]._id;
                        }
                        if (existing_courses.hasOwnProperty(temp.curso)) {
                            temp_schedule.course_id = existing_courses[temp.curso]._id;
                        }
                        if (existing_groups.hasOwnProperty(temp.turma)) {
                            temp_schedule.group_id = existing_groups[temp.turma]._id;
                        }

                        var weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                        var today = moment(new Date()).tz('Africa/Luanda');

                        var schedule = temp_schedule.schedule;
                        console.log('Schedule: ', schedule);

                        var term = subject.semester.name;
                        var start = moment(new Date(subject.semester.start)).tz('Africa/Luanda');
                        var end = moment(new Date(subject.semester.end)).tz('Africa/Luanda');
                        var break_start, break_end;

                        if (today.isAfter(end)) {
                            result.status = false;
                            result.failed.push(temp);
                            result.messages.push('Erro (Horários): a disciplina ' + subject.name + ' pertence a um semestre passado');
                            //console.log(result.failed);
                            continue;
                        }

                        if (term == 'year') {
                            break_start = moment(new Date(school.semesters.first.end)).tz('Africa/Luanda');
                            break_end = moment(new Date(school.semesters.second.start)).tz('Africa/Luanda');
                        }

                        var locale = today.toLocaleString();
                        console.log('Today: ', locale);

                        var sessions = [];

                        for (var k = 1; k <= 5; k++) {
                            var weekday = weekdays[k];

                            if (schedule.hasOwnProperty(weekday) && schedule[weekday].start !== '' && schedule[weekday].end !== '' && schedule[weekday].start !== '0:00' && schedule[weekday].end !== '0:00' && typeof(schedule[weekday].start) !== 'undefined' && typeof(schedule[weekday].end) !== 'undefined') {

                                var start_weekday = start.day(); //index
                                var session_weekday = weekdays.indexOf(weekday);
                                var diff = (start_weekday < session_weekday) ? session_weekday - start_weekday : 7 - start_weekday + session_weekday;

                                var start_str = schedule[weekday].start.split(":");
                                var end_str = schedule[weekday].end.split(":");
                                var session_date = moment(new Date(start.year(), start.month(), start.date(), start_str[0], start_str[1])).tz('Africa/Luanda');
                                var start_date = moment(session_date).add(diff, 'days');
                                var current = start_date;
                                var next = moment(session_date).add(7, 'days');
                                //create professor absences until temp date + 7 is greater than end date

                                var absence = {
                                    user: temp_schedule.professor,
                                    phone: temp_schedule.professor,
                                    school: school._id,
                                    year: subject.year,
                                    schedule: '',
                                    type: 'professor',
                                    course: course.name,
                                    subject: subject.name,
                                    supervisor_phone: course.supervisor.phone,
                                    message: 'O professor ' + professor.firstname + ' ' + professor.lastname + ' faltou à aula de ' + subject.name,
                                    supervisor_message: 'O professor ' + professor.firstname + ' ' + professor.lastname + ' faltou à aula de ' + subject.name,
                                    time: []
                                };

                                /*
                                if (k == 4) {
                                    //console.log('Start Weekday: ', start_weekday);
                                    //console.log('Session Weekday: ', session_weekday);
                                    //console.log('Diff: ', diff);
                                    //console.log('session_date: ', session_date);
                                    //console.log('start date: ', current);
                                    //console.log('Next date: ', next);
                                    //console.log('Absence: ', absence);
                                }
                                */

                                while (current.isSameOrBefore(end)) {
                                    if (typeof break_start != 'undefined' && typeof break_end != 'undefined' && (current.isSameOrAfter(break_start) || current.isBefore(break_end))) {
                                        current = moment(next);
                                        next = moment(current).add(7, 'days');
                                        continue;
                                    }

                                    var current_locale = current.toLocaleString();
                                    var message = 'O professor ' + professor.firstname + ' ' + professor.lastname + ' faltou à aula de ' + subject.name;
                                    var supervisor_message = 'O professor ' + professor.firstname + ' ' + professor.lastname + ' faltou à aula de ' + subject.name;
                                    var end_time = moment(current);
                                    end_time.hours(parseInt(end_str[0])).minutes(parseInt(end_str[1]));
                                    absence.time.push({
                                        start: current.format(),
                                        end: end_time.format(),
                                        late: 20,
                                        message: message + ' no dia ' + current.format("D/MMM/YYYY") + ' às ' + current.format("k:mm"),
                                        supervisor_message: supervisor_message + ' no dia ' + current.format("D/MMM/YYYY") + ' às ' + current.format("k:mm"),
                                    });

                                    current = moment(next);
                                    next = moment(current).add(7, 'days');
                                }

                                temp_schedule.absences.push(absence);
                            }
                        }

                        if (temp_schedule.absences.length > 0) {
                            result.passed[temp_schedule.course + '_' + temp_schedule.subject + '_' + temp_schedule.professor] = temp_schedule;
                            result.data.push(temp_schedule);
                        }
                    }

                    result.data = Object.keys(result.passed).map(function(k) {
                        return result.passed[k];
                    });
                    //console.log(result);
                    return result;
                };

                validate.professors = function(data, existing, school) {
                    var result = {
                        status: true,
                        messages: [],
                        passed: {},
                        data: [],
                        failed: []
                    };

                    var keys = ['nome', 'apelido', 'email', 'telefone', 'descricao'];

                    for (var i = 0; i < data.length; i++) {
                        var temp = data[i];
                        var fields = Object.keys(temp);

                        var validate_data = validate.validate_data('professores', temp, i, keys, existing, temp.email);

                        if (validate_data.status === false) {
                            result.status = false;
                            result.failed.push(validate_data);
                            result.messages.push(validate_data.message);
                            continue;
                        }

                        validate_data = validate.validate_data('professores', temp, i, keys, existing, temp.telefone);

                        if (validate_data.status === false) {
                            result.status = false;
                            result.failed.push(validate_data);
                            result.messages.push(validate_data.message);
                            continue;
                        }

                        temp = validate_data.data;


                        result.passed[temp.telefone] = {
                            firstname: temp.nome,
                            lastname: temp.apelido,
                            school: school._id,
                            phone: temp.telefone,
                            email: temp.email,
                            bio: temp.descricao,
                            type: 'professor'
                        };
                        result.data.push(result.passed[temp.telefone]);
                    }
                    result.data = Object.keys(result.passed).map(function(k) {
                        return result.passed[k];
                    });
                    return result;
                };

                validate.students = function(data, existing, school, courses, existing_courses, groups, existing_groups) {
                    var result = {
                        status: true,
                        messages: [],
                        passed: {},
                        data: [],
                        failed: []
                    };

                    var keys = ['nome', 'apelido', 'email', 'telefone', 'nome_encarregado', 'apelido_encarregado', 'email_encarregado', 'telefone_encarregado', 'curso', 'turma', 'ano'];

                    for (var i = 0; i < data.length; i++) {
                        var temp = data[i];
                        var fields = Object.keys(temp);

                        var validate_data = validate.validate_data('estudantes', temp, i, keys, existing, temp.email);

                        if (validate_data.status === false) {
                            result.status = false;
                            result.failed.push(validate_data);
                            result.messages.push(validate_data.message);
                            continue;
                        }

                        validate_data = validate.validate_data('estudantes', temp, i, keys, existing, temp.telefone);

                        if (validate_data.status === false) {
                            result.status = false;
                            result.failed.push(validate_data);
                            result.messages.push(validate_data.message);
                            continue;
                        }

                        temp = validate_data.data;

                        //Ensure course exists
                        if (!existing_courses.hasOwnProperty(temp.curso) && !courses.hasOwnProperty(temp.curso)) {
                            result.status = false;
                            result.messages.push('Erro: o curso ' + temp.curso + ' não existe');
                            result.failed.push(temp);
                            continue;
                        }

                        //Ensure group exists
                        if (!existing_groups.hasOwnProperty(temp.turma) && !groups.hasOwnProperty(temp.turma)) {
                            result.status = false;
                            result.messages.push('Erro: a turma ' + temp.turma + ' não existe');
                            result.failed.push(temp);
                            continue;
                        }

                        if (!result.passed.hasOwnProperty(temp.telefone)) {

                            result.passed[temp.telefone] = {
                                firstname: temp.nome,
                                lastname: temp.apelido,
                                school: school._id,
                                course: temp.curso,
                                phone: temp.telefone,
                                email: temp.email,
                                type: 'student',
                                year: temp.ano,
                                supervisor: {
                                    firstname: temp.nome_encarregado,
                                    lastname: temp.apelido_encarregado,
                                    email: temp.email_encarregado,
                                    phone: temp.telefone_encarregado
                                },
                                group: temp.turma
                            };

                            if (existing_courses.hasOwnProperty(temp.curso)) {
                                result.passed[temp.telefone].course_id = existing_courses[temp.curso]._id;
                            }
                            if (existing_groups.hasOwnProperty(temp.turma)) {
                                result.passed[temp.telefone].group_id = existing_groups[temp.turma]._id;
                            }

                            result.data.push(result.passed[temp.telefone]);
                        }
                    }
                    result.data = Object.keys(result.passed).map(function(k) {
                        return result.passed[k];
                    });
                    return result;
                };

                return validate;
            }
        ]);
})();