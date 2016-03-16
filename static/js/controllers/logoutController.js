app.controller('logoutController', ['$scope', '$interval', '$timeout', function($scope, $interval, $timeout)
{
    window.localStorage.removeItem('username');
    $scope.counter = 3;
    
    $scope.countDown = $interval(function()
    {
        $scope.counter--;
        if ($scope.counter < 1) 
        {
            $interval.cancel($scope.countDown);
            $timeout(function(){ window.location = '/'; },200);
        }
    }, 1000);
}])