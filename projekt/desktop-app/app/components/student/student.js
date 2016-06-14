app.controller('student', ['$scope', '$state', '$stateParams', '$calendar', 'uiCalendarConfig', function($scope, $state, $stateParams, $calendar, uiCalendarConfig) {

var id = $stateParams.id;

var date = new Date(),
  d = date.getDate(),
  m = date.getMonth(),
  y = date.getFullYear();

$scope.events = [];
$scope.firstCourse = '';


$calendar.getSchedule(id).then(function (result) {
  $scope.course = result.data;
  angular.forEach(result.data.content, function(val, index) {
    $scope.events.push(val);
  });
});

$scope.changeView = function(view,calendar) {
  uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
};

$scope.eventsF = function (start, end, timezone, callback) {
  var s = new Date(start).getTime() / 1000;
  var e = new Date(end).getTime() / 1000;
  var m = new Date(start).getMonth();
  callback($scope.events);
  colorizeCalendar();
};

    $scope.getNextCourseDate = function() {
        $calendar.getSchedule(id).then(function (result) {
           var date = '';
           angular.forEach(result.data.content, function(val, index){
              if (date === '') {
                if ( moment().format('YYYY-MM-DD') <= val.start ){
                   date = val.start;
                   $scope.selectStartDate = val.start;
                }
              }
           });

            $('#calendar').fullCalendar('gotoDate', date);

        });
    };

    $scope.getNextCourseDate();
    $scope.uiConfig = {
        calendar: {
          defaultView: "month",
          editable: true,
          header: {
            left: 'title',
            center: '',
            right: 'today prev,next',
          },
          dayClick: $scope.goToRootScopeDate,

        },
      };


$scope.eventSources = [$scope.eventsF];

$scope.classes = [];
$calendar.getSchedule(id)
  .then(function(res) {
    var data = res.data;
    angular.forEach(data.content, function(val, key) {
      $scope.classes.push({id: key, title: val.title});
    });
  });


$scope.courses = [];
$calendar.getSchedule()
   .then(function(res) {
     var data = res.data;
     angular.forEach(data, function(val, key) {
       $scope.courses.push({name: key, content: val});
     });
   });
}]);
