app.controller('loginController', ['$scope', '$http', '$window', '$timeout', 
function($scope, $http, $window, $timeout)
{
    $scope.username = '';
    $scope.password = '';
    $scope.isBadLogin = false;
    $scope.usernameIsTaken = false;
    
    $scope.login = function()
    {
        var body = { username: $scope.username, password: $scope.password};
        
        $http.post('/login', body).then(function successCallback(res)
        {
            $window.location.href = '/notes.html';
        }, function errorCallback(res)
        {
            $scope.isBadLogin = true;
            $timeout(function(){ $scope.isBadLogin = false }, 2000);
        });
    }
    
    $scope.register = function()
    {
        var body = { username: $scope.username, password: $scope.password};
        
        $http.post('/register', body).then(function successCallback(res)
        {
            $window.location.href = '/notes.html';
        }, function errorCallback(res)
        {
            $scope.usernameIsTaken = true;
            $timeout(function(){ $scope.usernameIsTaken = false; }, 2000);
        });
    }
}])