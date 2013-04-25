/**
 * Services that persists and retrieves TODOs from mongolab.
 */
todomvc.factory( 'mongolabStorage', function($resource) {
  var database = 'tester-db';
  var collection = 'todos';
  var url = 'https://api.mongolab.com/api/1/databases/'+database+'/collections/'+collection+'/:id';
  var apiKey = '50e001eae4b0d84e5fee619f';
  var resource = $resource(
          url,
    	  { apiKey: apiKey }, 
    	  { update: {method:'PUT'} }//"update" is additional method
      );
      
  var storage = {
        //get list
        query: function() {
          return resource.query();
        },
        
        //add new item
        save: function(item, items) {
          resource.save(item,function(stored){
              items.splice( items.indexOf(item), 1, stored );//set "_id" for added item
          });
        },
        
        //update item
        update: function(item) {
            resource.update({id: item._id.$oid}, angular.extend({}, item, {_id:undefined}));//need to unset "_id"
        },
        
        //remove item
        remove: function(item) {
            return resource.remove({id: item._id.$oid});
        }
    };

    return storage;
  
});
