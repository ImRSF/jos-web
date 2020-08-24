import { getUrlParameter } from "../misc.js";

$(document).ready(function() {
  $(".dropdown").on("show.bs.dropdown", function() {
    let getPersonnelID = $(this).attr("data-personnelID");
    let getStatusID = getUrlParameter("statusID");
    $.ajax({
      url: "/auth/profile",
      method: "GET",
      data: { personnelID: getPersonnelID, statusID: getStatusID },
      success(data) {
        let joByStatus = data.noOfJobOrderByStatus[0];
        $(".user-profile-JOSubmitted").html(joByStatus.Submitted);
        $(".user-profile-JOServed").html(joByStatus.Served);
        $(".user-profile-JOPending").html(joByStatus.Pending);
        $(".user-profile-JOCancelled").html(joByStatus.Cancelled);
        $(".user-profile-JOReturned").html(joByStatus.Returned);
      }
    });
  });
});
