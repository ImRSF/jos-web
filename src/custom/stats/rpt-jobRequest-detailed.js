import { displayBlankIfValueIsNull } from "../misc.js";

const cleanValues = val => {
  if (val) {
    return val;
  } else if (val == "1900-01-01") {
    return "";
  }
  else {
    return "";
  }
};

export const jobRequestDetailedReport = (doc, details) => {
  // 1st Section (Title)
  doc.setFontSize(15);
  doc.setFontStyle("bold");
  doc.text(`${details.CompanyName}`, 60, 15);
  doc.setFontStyle("normal");
  doc.text("Information System Services", 80, 25);
  doc.setFontStyle("bold");
  doc.text("JOB REQUEST FORM", 85, 35);

  // 2nd Section (Department ~ Subject)
  doc.setFontSize(13);
  doc.text("Department   :", 10, 50);
  doc.setFontStyle("normal");
  doc.text(`${details.DepartmentName}`, 45, 50);
  doc.setFontStyle("bold"); 
  doc.text("Section          :", 10, 60);
  doc.setFontStyle("normal");
  doc.text(`${details.SectionDescription}`, 45, 60);
  doc.setFontStyle("bold");
  doc.text("Job Request #  :", 130, 50);
  doc.setFontStyle("normal");
  doc.text(`${details.RequestNumber}`, 170, 50);
  doc.setFontStyle("bold");
  doc.text("Status               :", 130, 60);
  doc.setFontStyle("normal");
  doc.text(`${details.StatusName}`, 170, 60);
  doc.setFontStyle("bold");
  doc.text("Date Requested   :", 10, 70);
  doc.setFontStyle("normal");
  doc.text(`${details.DateSent.substring(0, 10)}`, 53, 70);
  doc.setFontStyle("bold");
  doc.text(`Date Approved :`, 130, 70);
  doc.setFontStyle("normal");
  doc.text(`${details.DateApprovedOrCancelled.substring(0, 10) === "1900-01-01" ? "" : details.DateApprovedOrCancelled.substring(0, 10)}`, 170, 70);
  doc.setFontStyle("bold");
  doc.text("Attached JO  :", 10, 80);
  doc.setFontStyle("normal");
  doc.text(`${cleanValues(details.JobNumber)}`, 45, 80);
  doc.setFontStyle("bold"); 
  doc.text("Contact #          :", 130, 80);
  doc.setFontStyle("normal");
  doc.text(details.ContactNo || "", 170, 80)

  // 3rd Section (Description ~ Last line)
  doc.setFontStyle("bold");
  doc.text("Subject          :", 10, 90);
  doc.setFontStyle("italic");
  doc.text(`${details.RequestSubject}`, 45, 90);
  doc.setFontStyle("bold");
  doc.text("Description", 10, 110);
  doc.setFontStyle("normal");
  doc.setLineWidth(0.5);
  doc.text(`${details.RequestDescription.substring(0, 86)}`, 10, 119);
  doc.line(10, 120, 205, 120);
  doc.text(`${details.RequestDescription.substring(87, 172)}`, 10, 124);
  doc.line(10, 125, 205, 125);
  doc.text(`${details.RequestDescription.substring(173, 260)}`, 10, 129);
  doc.line(10, 130, 205, 130);
  doc.text(`${details.RequestDescription.substring(261, 347)}`, 10, 134);
  doc.line(10, 135, 205, 135);
  doc.text(`${details.RequestDescription.substring(348, 434)}`, 10, 139);
  doc.line(10, 140, 205, 140);

  // 4th Section (Requested By ~ Approved By)
  doc.setFontSize(15);
  doc.setFontStyle("bold");
  doc.setLineWidth(0.5);
  doc.text("Requested By", 10, 230);
  doc.setFontStyle("normal");
  doc.text(`${details.RequestedByName}`, 10, 237);
  doc.line(10, 238, 65, 238);
  doc.setFontStyle("italic");
  doc.text(`${details.RequestedByPosition}`, 10, 243);
  doc.setFontStyle("bold");
  doc.text(`${displayCancelledOrApproved(details.StatusName)} By`, 10, 253);
  doc.setFontStyle("normal");
  doc.text(`${displayBlankIfValueIsNull(displayApprovedBy(details).name)}`, 10, 260);
  doc.line(10, 261, 65, 261);
  doc.setFontStyle("italic");
  doc.text(`${displayBlankIfValueIsNull(displayApprovedBy(details).position)}`, 10, 266);
  if (details.StatusName === "Approved" || details.AssignedTo) {
    doc.setFontStyle("bold");
    doc.text("Assigned To", 143, 253);
    doc.setFontStyle("normal");
    doc.text(`${displayBlankIfValueIsNull(details.AssignedToName)}`, 143, 260);
    doc.line(143, 261, 201, 261);
    doc.setFontStyle("italic");
    doc.text(`${displayBlankIfValueIsNull(details.AssignedToPosition)}`, 143, 266);
  }

  doc.output("dataurlnewwindow");
  //window.close();
};

const displayCancelledOrApproved = statusName => {
  if (statusName === "Cancelled") {
    return statusName;
  } else {
    return "Approved";
  }
};

const displayApprovedBy = details => {
  if (details.StatusName === "Submitted") {
    return {
      name: "",
      position: ""
    };
  } else {
    return {
      name: details.ApprovedByName,
      position: details.ApprovedByPosition
    };
  }
};