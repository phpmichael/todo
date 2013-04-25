/**
 * The main controller for the app. The controller:
 * - retrieves and persist the model via the storage service
 * - exposes the model to the template and provides event handlers
 */
todomvc.controller( 'TodoCtrl', function TodoCtrl( $scope, $location, mongolabStorage, filterFilter ) {
  	//Get todo list
	$scope.todos = mongolabStorage.query();
	
	$scope.action_name = "Add";
	$scope.todoIndex = null;
	$scope.todo = {text:'', done:false, priority:9};
	
	if ( $location.path() === '' ) $location.path('/');
	$scope.location = $location;
	
	//Watch: Location 
	$scope.$watch( 'location.path()', function( path ) {
		//filter by "done"
	    $scope.statusFilter = (path == '/active') ?
		  { done: false } : (path == '/completed') ?
			{ done: true } : null;
		//filter by "priority"	
		$scope.priorityFilter = (path == '/high') ?
		  { priority: 1 } : (path == '/normal') ?
			{ priority: 2 } : (path == '/low') ?
		  		{ priority: 3 } : null;
	});
	 
	//Add/Update/remove todos
	$scope.saveTodo = function() {
		if($scope.action_name == "Add") $scope.todos.push( $scope.todo );
		else {
			if($scope.todo.text == "") $scope.todos.splice( $scope.todoIndex, 1); //Remove
			else $scope.todos.splice( $scope.todoIndex, 1, $scope.todo ); //Update
		}
		//use storage
		$scope.store($scope.todo);
		
		$scope.resetForm();
	};
	
	//Edit todo
	$scope.editTodo = function(todo){
		$scope.action_name = "Update";
		$scope.todoIndex = $scope.todos.indexOf(todo);
		$scope.todo = todo;
	};
 
	//Count Remaining Todos
	$scope.remaining = function() {
	  var count = 0;
	  angular.forEach($scope.todos,function(todo){
		  count += (todo.done)?0:1;
	  });
	  return count;
	};
	
	//Archive todos
	$scope.archive = function() {
		var tempTodos = [];
	    angular.forEach($scope.todos, function(todo, index){
		    if(todo.done) {
		        //use storage
			    todo.text = "";
			    $scope.store(todo);
			}
			else tempTodos.push(todo);
		});
		
		$scope.todos = tempTodos;
	};
	
	//Set Todo Priority
	$scope.setPriority = function(todo, priority) {
		todo.priority = priority;
		//use storage
		$scope.store( todo );
	};
	
	$scope.priorityNgClass = function(priority) {
		switch(priority) {
			case 1:
				return 'label-important';
			break;
			case 2:
				return 'label-warning';
			break;
			case 3:
				return 'label-info';
			break;
		}
	};
	
	//Reset 
	$scope.resetForm = function() {
		$scope.action_name = "Add";
		$scope.todoIndex = null;
		$scope.todo = {text:'', done:false, priority:9};
	}
	
	//Use storage
	$scope.store = function(todo) {
	    if( typeof(todo._id) != "undefined" )
	    {
	        if( todo.text == "" ) mongolabStorage.remove( todo );
	        else mongolabStorage.update( todo );
	    }
	    else mongolabStorage.save( todo, $scope.todos );
	}
});
