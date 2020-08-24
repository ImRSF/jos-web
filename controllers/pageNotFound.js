const Misc = require("../models/misc");
exports.get404 = async (req, res, next) => {
  return res.status(404).render("404", { pageTitle: "404 - Page Not Found", path: "/404", assignedCategoriesLink: await Misc.getAssignedCategoriesLink(req.session.assignedCategoryID) });
};

 