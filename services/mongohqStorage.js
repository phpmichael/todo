/**
 * Services that persists and retrieves TODOs from mongohq.
 */
todomvc.config(['$httpProvider', function($httpProvider) {
        delete $httpProvider.defaults.headers.common["X-Requested-With"]
    }]);
    
todomvc.factory( 'mongohqStorage', function($resource) {
  var database = 'tester-db';
  var collection = 'todos';
  var url = 'https://api.mongohq.com/databases/'+database+'/collections/'+collection+'/documents/:id';
  var apiKey = '100e9b0kvvgkrt8m2zno';
  var resource = $resource(
          url,
    	  { _apikey: apiKey }, 
    	  { update: {method:'PUT'} }//"update" is additional method
      );
      
  var storage = {
        //get list
        query: function() {
          return resource.query();
        },
        
        //add new item
        save: function(item, items) {
          stored = resource.save({document: item},function(stored){
              items.splice( items.indexOf(item), 1, angular.extend({}, item, {_id:{"$oid":stored._id}}) );//set "_id" for added item
          });
        },
        
        //update item
        update: function(item) {
            resource.update({id: item._id.$oid}, {document:  angular.extend({}, item, {_id:undefined}) } );//need to unset "_id"
        },
        
        //remove item
        remove: function(item) {
            return resource.remove({id: item._id.$oid});
        }
    };

    return storage;
  
});
