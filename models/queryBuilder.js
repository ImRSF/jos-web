const sql = require("sql-query");
const sqlQuery = sql.Query("mssql");

module.exports = class QueryBuilder {
  static CreateQuery() {
    const sqlSelect = sqlQuery.select();
    return sqlSelect
      .from("RMS.dbo.tblCompany")
      .select("CompanyName")
      .where({CompanyName: sql.like('%Test%') })
      .build();
  }
};
