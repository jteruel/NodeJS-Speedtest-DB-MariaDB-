'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  db.createTable('records', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    date: { type: 'datetime', defaultValue: 'CURRENT_TIMESTAMP' }, 
    isp: { type:'string'},
    isp_server: { type:'string'},
    isp_client: { type:'string'}, 
    upload: { type:'string'},
    download: { type:'string'}, 

  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('records', callback);
};

exports._meta = {
  "version": 1
};
