app.controller('userController', ['$scope', '$interval', '$timeout', function($scope, $interval, $timeout)
{
    $scope.username = window.localStorage.getItem('username');
}])