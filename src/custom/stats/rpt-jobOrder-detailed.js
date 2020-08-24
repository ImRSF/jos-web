export const jobOrderDetailed = (doc, details, jobItems) => {
  // 1st Section
  title(doc, details);
  // 2nd Section
  head(doc, details);
  // 3rd Section
  body(doc, details, jobItems.length);
  // 4th Section (Requested By ~ Noted By)
  footer(doc, details);
  // Next Page: Job Items
  displayJobItems(doc, details, jobItems);
  // Open PDF in new window
  doc.output("dataurlnewwindow");
  //window.close();
};

const title = (doc, details) => {
  doc.setFontSize(15);
  doc.setFontStyle("bold");
  doc.text(`${details.CompanyName}`, 60, 15);
  doc.setFontStyle("normal");
  doc.text("Information System Services", 80, 25);
  doc.setFontStyle("bold");
  doc.text("JOB ORDER FORM", 85, 35);
};

const head = (doc, details) => {
  doc.setFontSize(13);
  doc.text("Department   :", 10, 50);
  doc.setFontStyle("normal");
  doc.text(`${details.DepartmentName}`, 45, 50);
  doc.setFontStyle("bold");
  doc.text("Section          :", 10, 60);
  doc.setFontStyle("normal");
  doc.text(`${details.SectionDescription || ""}`, 45, 60);
  doc.setFontStyle("bold");
  doc.text("Job Order #  :", 130, 50);
  doc.setFontStyle("normal");
  doc.text(`${details.JobNumber}`, 170, 50);
  doc.setFontStyle("bold");
  doc.text("Status               :", 130, 60);
  doc.setFontStyle("normal");
  doc.text(`${details.StatusName}`, 170, 60);
  doc.setFontStyle("bold");
  doc.text("Date Requested   :", 10, 70);
  doc.setFontStyle("normal");
  doc.text(`${details.DateRequested.substring(0, 10)}`, 53, 70);
  doc.setFontStyle("bold");
  doc.text(`Date Served :`, 130, 70);
  doc.setFontStyle("normal");
  doc.text(`${displayDateServed(details.DateServed)}`, 170, 70);
  doc.setFontStyle("bold");
  doc.text("Deadline   :", 10, 80);
  doc.setFontStyle("normal");
  doc.text(`${details.Deadline.substring(0, 10)}`, 53, 80);
  doc.setFontStyle("bold");
  doc.text("Priority :", 130, 80);
  doc.setFontStyle("normal");
  doc.text(`${details.PriorityName}`, 170, 80);
};

const body = (doc, details, jobItems) => {
  doc.setFontStyle("bold");
  doc.text("Category       :", 10, 90);
  doc.setFontStyle("italic");
  doc.text(
    `${details.CategoryName || ""}-${
    details.SubCategoryName || ""
    }`,
    45,
    90
  );
  doc.setFontStyle("bold");
  doc.text("Job Items   :", 10, 100);
  doc.setFontStyle("italic");
  doc.text(
    `${
    jobItems > 0 ? "Please see the attached page." : "None attached."
    }`,
    45,
    100
  );

  doc.setFontStyle("bold");
  doc.text("Details", 10, 110);
  doc.setFontStyle("normal");
  doc.text(`${details.Details.substring(0, 86)}`, 10, 119);
  doc.line(10, 120, 205, 120);
  doc.text(`${details.Details.substring(87, 172)}`, 10, 124);
  doc.line(10, 125, 205, 125);
  doc.text(`${details.Details.substring(173, 260)}`, 10, 129);
  doc.line(10, 130, 205, 130);
  doc.text(`${details.Details.substring(261, 347)}`, 10, 134);
  doc.line(10, 135, 205, 135);
  doc.text(`${details.Details.substring(348, 434)}`, 10, 139);
  doc.line(10, 140, 205, 140);
  doc.setFontStyle("bold");
  doc.text("Actions", 10, 150);
  doc.setFontStyle("normal");
  doc.text(`${details.Actions.substring(0, 86)}`, 10, 159);
  doc.line(10, 160, 205, 160);
  doc.text(`${details.Actions.substring(87, 172)}`, 10, 164);
  doc.line(10, 165, 205, 165);
  doc.text(`${details.Actions.substring(173, 260)}`, 10, 169);
  doc.line(10, 170, 205, 170);
  doc.text(`${details.Actions.substring(261, 347)}`, 10, 174);
  doc.line(10, 175, 205, 175);
  doc.text(`${details.Actions.substring(348, 434)}`, 10, 179);
  doc.line(10, 180, 205, 180);
  doc.setFontStyle("bold");
  doc.text("Remarks", 10, 190);
  doc.setFontStyle("normal");
  doc.text(`${details.Remarks.substring(0, 86)}`, 10, 199);
  doc.line(10, 200, 205, 200);
  doc.text(`${details.Remarks.substring(87, 172)}`, 10, 204);
  doc.line(10, 205, 205, 205);
  doc.text(`${details.Remarks.substring(173, 260)}`, 10, 209);
  doc.line(10, 210, 205, 210);
  doc.text(`${details.Remarks.substring(261, 347)}`, 10, 214);
  doc.line(10, 215, 205, 215);
  doc.text(`${details.Remarks.substring(348, 434)}`, 10, 219);
  doc.line(10, 220, 205, 220);
};

const footer = (doc, details) => {
  doc.setFontStyle("bold");
  doc.text("Requested By", 10, 230);
  doc.setFontStyle("normal");
  doc.text(`${details.RequestedByName}`, 10, 237);
  doc.line(10, 238, 65, 238);
  doc.setFontStyle("italic");
  doc.text(`${details.RequestedByPosition}`, 10, 243);
  doc.setFontStyle("bold");
  doc.text("Assigned To", 143, 230);
  doc.setFontStyle("normal");
  doc.text(`${details.AssignedToName}`, 143, 237);
  doc.line(143, 238, 201, 238);
  doc.setFontStyle("italic");
  doc.text(`${details.AssignedToPosition}`, 143, 243);
  doc.setFontStyle("bold");
  doc.text("Reviewed By", 10, 253);
  doc.setFontStyle("normal");
  doc.text(`${details.ReviewedByName}`, 10, 260);
  doc.line(10, 261, 65, 261);
  doc.setFontStyle("italic");
  doc.text(`${details.ReviewedByPosition}`, 10, 266);
  doc.setFontStyle("bold");
  doc.text("Noted By", 143, 253);
  doc.setFontStyle("normal");
  doc.text("SUSMINA, JULIUS", 143, 260);
  doc.line(143, 261, 201, 261);
  doc.setFontStyle("italic");
  doc.text("ISS Manager", 143, 266);
};

const displayJobItems = (doc, details, jobItems) => {
  if (jobItems.length != 0) {
    doc.addPage("letter", "p");
    // 1st Section
    doc.setFontSize(15);
    doc.setFontStyle("bold");
    doc.text(`${details.CompanyName}`, 60, 15);
    doc.setFontStyle("normal");
    doc.text("Information System Services", 80, 25);
    doc.setFontStyle("bold");
    doc.text("ATTACHED JOB ITEMS", 85, 35);
    let head = [["Item Name", "Description", "Remarks", "Company"]];
    //let head = [["Item Name", "Workstation", "Description", "Serial #", "Date Acquired", "General Status"]];
    // NOTICE: Converts array of objects into array of arrays since jsPDF-autoTable only accepts array of arrays
    const x = jobItems.map(element => {
      return [
        element.JobItemName,
        element.JobItemDescription,
        element.JobItemRemarks,
        element.JobItemCompany
      ];
    });
    let body = x
    doc.autoTable({ head: head, body: body, margin: { top: 40 } });

    // 4th Section (Requested By ~ Noted By)
    doc.setFontSize(13);
    doc.setFontStyle("bold");
    doc.text("Requested By", 10, 230);
    doc.setFontStyle("normal");
    doc.text(`${details.RequestedByName}`, 10, 237);
    doc.line(10, 238, 65, 238);
    doc.setFontStyle("italic");
    doc.text(`${details.RequestedByPosition}`, 10, 243);
    doc.setFontStyle("bold");
    doc.text("Assigned To", 143, 230);
    doc.setFontStyle("normal");
    doc.text(`${details.AssignedToName}`, 143, 237);
    doc.line(143, 238, 201, 238);
    doc.setFontStyle("italic");
    doc.text(`${details.AssignedToPosition}`, 143, 243);
    doc.setFontStyle("bold");
    doc.text("Reviewed By", 10, 253);
    doc.setFontStyle("normal");
    doc.text(`${details.ReviewedByName}`, 10, 260);
    doc.line(10, 261, 65, 261);
    doc.setFontStyle("italic");
    doc.text(`${details.ReviewedByPosition}`, 10, 266);
    doc.setFontStyle("bold");
    doc.text("Noted By", 143, 253);
    doc.setFontStyle("normal");
    doc.text("SUSMINA, JULIUS", 143, 260);
    doc.line(143, 261, 201, 261);
    doc.setFontStyle("italic");
    doc.text("ISS Manager", 143, 266);
  }
};

const displayDateServed = (dateServed) => {
  if (dateServed || dateServed === "1900-01-01") {
    return dateServed.substring(0, 10);
  } else {
    return "";
  }
};
