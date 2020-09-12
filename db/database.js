const sqlite = require("sqlite3").verbose();
const util = require("util");
const { resolve } = require("path");
const { v4: uuidv4 } = require("uuid");

//Class for SQLite database
class liteDb {
  constructor() {
    // init database
    this.db = new sqlite.Database(resolve(__dirname, "db"), (err) => {
      if (err) console.error("Cannot connect to db.", err);
      else console.log("Connected to db");
    });
    //create tables after init
    this.createTables();
  }
  //hardcoded function for creating tables
  createTables() {
    //Queries for creating each table in database
    let createUsers =
      "create table if not exists users (userid text not null primary key, username text not null, password text not null)";
    let createChannel =
      "create table if not exists channels (userid text not null, channelid text not null, channelname text not null, foreign key (userid) references users(userid))";
    let createMessages =
      "create table if not exists messages (userid text not null,username text not null, channelid text not null, datetime text not null, message text not null, foreign key (userid) references users(userid), foreign key (channelid) references channels(channelid))";
    //
    //Serialized tables creation
    this.db.serialize(() => {
      this.db
        .run(createUsers, (err) => {
          if (err) console.log(err);
        })
        .run(createChannel, (err) => {
          if (err) console.log(err);
        })
        .run(createMessages, (err) => {
          if (err) console.log(err);
        });
    });
  }
  //adding row in current table
  // * args might be in right sequence (like it described in createTables function)
  addRow(table, ...args) {
    //add double quotes for arguments
    let values = args.map((val) => `"${val}"`).join(",");
    //adding row in db
    // * wrapped in serialize in case if i will add something like responce etc.
    this.db.serialize(() => {
      this.db.run(
        util.format("insert into %s values ( %s )", table, values),
        (err) => {
          if (err) console.log(err);
          // console.log("no misstakes in here");
        }
      );
    });
  }
  async getAllRows(table) {
    let promise = new Promise((resolve, reject) => {
      this.db.all(util.format("select * from %s", table), (err, rows) => {
        if (err) console.log(err);
        console.log(rows);
        resolve(rows);
      });
    });
    return await promise;
  }
  //returns uuid of user or null if wrong username-password
  async getLoggedInUserid(username, password) {
    let promise = new Promise((resolve, reject) => {
      this.db.get(
        "select userid from users where username = ? and password = ?",
        [username, password],
        (err, rows) => {
          if (err) console.log(err);
          if (util.isUndefined(rows)) resolve(null);
          else resolve(rows);
        }
      );
    });
    let res = await promise;
    if (res) res = res.userid;
    return res;
  }
  //register new user. if user already has account - returns null. else - uuid
  async registerNewUser(username, password) {
    //if user already registered
    if (await this.getLoggedInUserid(username, password)) {
      return null;
    } else {
      let uuid = uuidv4();
      this.addRow("users", uuid, username, password);
      return uuid;
    }
  }
  //add new channel. Returns id of this channel
  addChannel(channelName, connectedUserId, defaultChannelId = "") {
    let channelid = defaultChannelId ? defaultChannelId : uuidv4();
    this.addRow("channels", connectedUserId, channelid, channelName);
    return channelid;
  }
  //get all available for user channels
  async getAvailableChannels(userid) {
    let promise = new Promise((resolve, reject) => {
      this.db.all(
        "select * from channels where userid = ?",
        [userid],
        (err, rows) => {
          if (err) console.log(err);
          else {
            resolve(rows);
          }
        }
      );
    });
    return await promise;
  }

  async getChannelMessages(channelid) {
    let promise = new Promise((resolve, reject) => {
      this.db.all(
        "select * from messages where channelid = ?",
        [channelid],
        (err, rows) => {
          if (err) console.log(err);
          else {
            resolve(rows);
          }
        }
      );
    });
    return await promise;
  }
  //manual closing db
  closeDb() {
    this.db.close();
  }
}
module.exports.liteDb = liteDb;

// let db = new liteDb();
// console.log(db.getAllRows("users"));
// db.closeDb();
