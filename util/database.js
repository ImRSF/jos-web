const mssql = require("mssql");

const prodServer = {
  user: "sa",
  password: "sa123",    
  server: "192.168.200.38\\SQL16",
  database: "JOS-Web",
  port: 1439  
};
 
const testServer = {
  user: "sa",
  password: "sa123",
  server: "192.168.200.92",
  database: "JOS-Web", 
  port: 1433   
};

const devServer = {
  user: "sa",
  password: "sa123",
  server: "localhost\\MSSQLSERVER2016",
  database: "JOS-Web",    
  port: 1439  
}; 

const config = prodServer;

const pool = new mssql.ConnectionPool(config)
  .connect()
  .then(pool => {
    return pool; 
  }); 
    
module.exports = {pool, config};     
