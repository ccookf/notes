app.controller('notesController', ['$scope', '$http', 'getNotes', function($scope, $http, getNotes)
{
    getNotes.success(function(data)
    {
        $scope.notes = data;
    });
    $scope.delete = function(data)
    {
        $http.post('/notes/delete',data);
        var elem = document.getElementById(data._id);
        elem.remove();
    }
}]);