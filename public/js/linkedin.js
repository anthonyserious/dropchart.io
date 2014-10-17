var dropUser = -1;

function getMember(){
  console.log('calling the member');
  IN.API.Profile("me").result(function(result) {
    dropUser = result.values[0].id;
    // push to db
    // debugger;
    return result.values[0];
  });
};



$(function() {

  $('.IN-widget').on('click', function(e) {
    // stop propagation because linkedin login button is awful
    e.stopPropagation();
  });

});