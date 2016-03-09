app.factory('getNotes', ['$http', function($http)
{
    return $http.get('/notes/read').success(function(data)
    {
        return data;
    }).error(function(err)
    {
        return err; 
    });
}]);