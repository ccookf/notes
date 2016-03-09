app.controller('notesController', ['$scope', 'getNotes', function($scope, getNotes)
{
    getNotes.success(function(data)
    {
        $scope.notes = data;
    });
}]);