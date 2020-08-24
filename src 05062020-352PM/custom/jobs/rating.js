var $stars;

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
      switch (index) {
        case '0':
          $($stars.get(i)).addClass('oneStar');
          break;
        case '1':
          $($stars.get(i)).addClass('twoStars');
          break;
        case '2':
          $($stars.get(i)).addClass('threeStars');
          break;
        case '3':
          $($stars.get(i)).addClass('fourStars');
          break;
        case '4':
          $($stars.get(i)).addClass('fiveStars');
          break;
      }
    }
  }

  function unmarkActive() {
    $stars.removeClass('oneStar twoStars threeStars fourStars fiveStars');
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
 
});
