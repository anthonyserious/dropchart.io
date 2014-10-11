function getMember(){
  console.log('calling the member');
  IN.API.Profile("me").result(function(result) {
    // push to db
    return result.values[0];
  });
};

$(function() {

  $('.IN-widget').on('click', function(e) {
    // stop propagation because linkedin login button is awful
    e.stopPropagation();
  });

});