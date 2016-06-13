app.controller('student', ['$scope', '$state', '$stateParams', '$calendar', 'uiCalendarConfig', function($scope, $state, $stateParams, $calendar, uiCalendarConfig) {
var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();




$scope.events = [];

$calendar.getSchedule('MWD').then(function (result) {
    $scope.course = result.data;
    angular.forEach(result.data.content, function(val, index) {
        $scope.events.push(val);
    });
});
$scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
};

$scope.eventSources = [$scope.events];













  
}]);
