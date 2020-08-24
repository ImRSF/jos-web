const db = require("../util/database");
// const xmlBuilder = require("xml2js");
// const fs = require("fs");

module.exports = class DBControl {
  async closeCon() {
    const pool = await db.pool;
    pool.close();
  }

  static async executeSP(spName, sqlParams = []) {
    try {
      const pool = await db.pool;
      const request = await pool.request();
      sqlParams.forEach(element => {
        request.input(element.name, element.value);
      });
      const result = await request.execute(spName);
      const dataSet = result.recordset;
      return dataSet;
    } catch (error) { 
      console.log(error)
    }
    await this.prototype.closeCon();
  } 

  static async getRecords(columnName, searchValue, spName) {
    const paramList = [
      { name: "ColumnValue", value: columnName },
      { name: "SearchValue", value: searchValue }
    ];
    return await this.executeSP(spName, paramList);
  }

  // static async selectRecords(param = []) {
  //   //{
  //     // call sp that will store all params in table 
      
  //   //}
  //   //{
  //   // call sp that will get all params in table and query
  //   //} 
  // }

  // static CreateSQLParamXML(sqlParams = []) {
  //   fs.readFile("./data/sample.xml", (err, data) => {
  //     xmlBuilder.parseString(data, (err, result) => {
  //       let json = result;
  //       json.SQLParamList.Column.push({
  //         ColumnName: "SystemUser",
  //         ColumnValue: "RSFlores",
  //         ColumnType: "VARCHAR(MAX)"
  //       });
  //       let builder = new xmlBuilder.Builder();
  //       let xml = builder.buildObject(json);
  //       fs.writeFile("./data/test.xml", xml, (err, data) => {
  //         if (err) console.log(err);
  //       });
  //     });
  //   });
  // } 
};
  