app.controller('student', ['toaster', '$scope', '$state', '$stateParams', '$calendar', 'uiCalendarConfig', function(toaster, $scope, $state, $stateParams, $calendar, uiCalendarConfig) {

    var id = $stateParams.id;
    if(id === ''){ $state.go('/student', {id: 'MWD'}); }

    var date = new Date(),
        d = date.getDate(),
        m = date.getMonth(),
        y = date.getFullYear();

    $scope.events = [];
    $scope.tempevents = [];
    $scope.firstCourse = '';
    $scope.selectStartDate = '2016-06-06';
    $scope.courseId = id;
    $scope.stringToColor = stringToColor;
    $scope.getReadableColor = getReadableColor;
    $scope.course = id;
    $scope.courseName = id;
    $scope.userRole = localStorage.role || 'student';
    $scope.admin = $scope.userRole === 'teacher';

    $calendar.getSchedule(id).then(function(result) {
        angular.forEach(result.data.content, function(val, index) {
            $scope.events.push(val);
            $scope.tempevents.push(val);
        });
    });

    $scope.changeView = function(view, calendar) {
        $('#calendar').fullCalendar('changeView', view);

    };

    $scope.eventsF = function(start, end, timezone, callback) {
        var s = new Date(start).getTime() / 1000;
        var e = new Date(end).getTime() / 1000;
        var m = new Date(start).getMonth();
        callback($scope.events);
        colorizeCalendar();
    };
    $scope.goToClass = function (info){

        angular.forEach($scope.events, function(val, index){
            if (val.title === info){
                $('#calendar').fullCalendar('gotoDate', val.start);
                resetCalendar();
                colorizeCalendar();
            }
        });

    };
    function resetCalendar(){
    $('#calendar').fullCalendar( 'rerenderEvents' );
    $('#calendar').fullCalendar( 'refetchEvents' );
    }

    $scope.getNextCourseDate = function() {
        $calendar.getSchedule(id).then(function(result) {
            var date = '';
            $scope.courseName = id;
            angular.forEach(result.data.content, function(val, index) {
                if (moment().format('YYYY-MM-DD') >= val.start && moment().format('YYYY-MM-DD') <= val.end) {
                        date = val.start;
                        $scope.selectStartDate = val.start;
                    }
                if (date === '') {
                    if (moment().format('YYYY-MM-DD') <= val.start) {
                        date = val.start;
                        $scope.selectStartDate = val.start;
                    }
                }
            });

            $scope.events = [];
            $scope.events = angular.copy($scope.tempevents);
            $('#calendar').fullCalendar('gotoDate', date);
            resetCalendar();
        });
    };

    $scope.eventModule = function(data) {
      $scope.showForm = true;
      $scope.courseData = data || '';
      $scope.today = new Date();
    };

    $scope.eventModule2 = function() {
      $scope.showForm2 = true;
      $scope.today = new Date();
      $scope.courseData2 = {
        title: '',
        start: '',
        end: ''
      }
    };

    $scope.eventModuleHide = function(opts) {
      $scope.showForm = false;
      $scope.showForm2 = false;
    };

    $scope.getCurrentEventId = function(event) {
      var i = 0;
      var length = $scope.events.length;
      var id;

      for (i; i < length; i++) {
        if($scope.events[i].title === event.title) {
          id = i;
        }
      }

      return id;
    };

    $scope.addEvent = function() {
        var newCourse = {
                title: $scope.courseData2.title,
                start: $scope.courseData2.start,
                end: $scope.courseData2.end
            };

        function checkIfCourseExist(event) {
            return event.title === $scope.courseData2.title;
        }

        function checkIfDateExist() {
            var range2 = moment.range(moment($scope.courseData2.start), moment($scope.courseData2.end));
            for(var i = 0; i < $scope.events.length; i++) {
                var range = moment.range(moment($scope.events[i].start), moment($scope.events[i].end));
                if(range.overlaps(range2)) return false;
            } return true;
        }
        if(!$scope.events.find(checkIfCourseExist) && $scope.courseData2.title !== '') {
            if($scope.courseData2.start !== '' && $scope.courseData2.end !== '' && checkIfDateExist()) {
                $scope.events.push(newCourse);
            
                $calendar.addCourse($scope.courseId, JSON.stringify($scope.events)).then(function() {
                    $scope.showForm2 = false;
                    toaster.success('Yay!', 'Kursen är nu tillagd.');
                });
            } else {
                toaster.info('Info', 'Datumet kolliderar med en annan kurs.');
            }
            
        } else {
            toaster.info('Info', 'Kursen du vill lägga till finns redan.');
        }

    };

    $scope.eventDelete = function() {
      var o = {
        type: $scope.courseId,
        title: $scope.courseData.title
      };

      $calendar.deleteCourse(o).then(
        function(res) {
          // uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents');
          $scope.events.splice($scope.getCurrentEventId($scope.courseData), 1);
          // uiCalendarConfig.calendars.myCalendar.fullCalendar('addEventSource', $scope.scope);
          colorizeCalendar();
          $scope.eventModuleHide();
          resetCalendar();
        }
      );
    };

    $scope.eventAdd = function() {

    };

    $scope.alertOnEventClick = function(data, jsEvent, view){
      $scope.eventModule(data);
    };

    $scope.getNextCourseDate();
    $scope.uiConfig = {
        calendar: {
            lang: 'sv',
            defaultView: 'month',
            editable: false,
            header: {
                left: 'title',
                center: '',
                right: 'today prev,next',
            },
            eventClick: $scope.alertOnEventClick,
            dayClick: $scope.goToRootScopeDate,
            defaultDate: $scope.selectStartDate
        },
    };


    $scope.eventSources = [$scope.eventsF];


    $scope.goToCourse = function(name){
        $state.go('/student', {id: name});
    };


    $scope.courses = [];
    $calendar.getSchedule()
        .then(function(res) {
            var data = res.data;
            angular.forEach(data, function(val, key) {
                $scope.courses.push({
                    name: key,
                    content: val
                });
            });
        });

}]);
