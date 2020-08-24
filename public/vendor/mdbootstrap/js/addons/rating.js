var $stars;


$(document).ready(function() {
  alert("Test")
})

jQuery(document).ready(function ($) {
  // Custom whitelist to allow for using HTML tags in popover content
  var myDefaultWhiteList = $.fn.tooltip.Constructor.Default.whiteList
  myDefaultWhiteList.textarea = [];
  myDefaultWhiteList.button = [];
  
  $stars = $('.rate-popover');
  $stars.on('click', function () {
    var index = $(this).attr('data-index');
    markStarsAsActive(index);
  });

  function markStarsAsActive(index) {
    unmarkActive();

    for (var i = 0; i <= index; i++) {
      $($stars.get(i)).removeClass('fa-meh-blank');
      $($stars.get(i)).addClass('live');
      switch (index) {
        case '0':
          $($stars.get(i)).addClass('fa-angry'); 
          $("#rateMe").data("rating", 0)
          break;
        case '1':
          $($stars.get(i)).addClass('fa-frown');
          $("#rateMe").data("rating", 1)
          break;
        case '2':
          $($stars.get(i)).addClass('fa-meh');
          $("#rateMe").data("rating", 2)
          break;
        case '3':
          $($stars.get(i)).addClass('fa-smile');
          $("#rateMe").data("rating", 3)
          break;
        case '4':
          $($stars.get(i)).addClass('fa-laugh');
          $("#rateMe").data("rating", 4)
          break;
      }
    }
  }
  function unmarkActive() {
    $stars.addClass('fa-meh-blank');
    $stars.removeClass('fa-angry fa-frown fa-meh fa-smile fa-laugh live');
  }

  $stars.on('click', function () {
    $stars.popover('hide');
  });

  // Submit, you can add some extra custom code here
  // ex. to send the information to the server
  $('#rateMe').on('click', '#voteSubmitButton', function () {
    $stars.popover('hide');
  });

  // Cancel, just close the popover
  $('#rateMe').on('click', '#closePopoverButton', function () {
    $stars.popover('hide');
  });

  
});

$(function () {
  $('.rate-popover').popover({
    // Append popover to #rateMe to allow handling form inside the popover
    container: '#rateMe',
    // Custom content for popover
    content: `<div class="my-0 py-0"> <textarea type="text" style="font-size: 0.78rem" class="md-textarea form-control py-0" placeholder="Write us what can we improve" rows="3"></textarea> <button id="voteSubmitButton" type="submit" class="btn btn-sm btn-primary">Submit!</button> <button id="closePopoverButton" type="button" class="btn btn-flat btn-sm">Close</button>  </div>`
  });
  $('.rate-popover').tooltip();
});
