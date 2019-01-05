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
    id: { type: 'int', primaryKey: true }, 
    date: { type: 'datetime' },
    isp: { type:'string'},
    isp_provider: { type:'string'},
    isp_lat: { type:'float(10,6)'},
    isp_long: { type:'float(10,6)'},
    upload: { type:'string'},
    download: { type:'string'},
    unadjusted_upload: { type:'string'},
    unadjusted_download: { type:'string'},

  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('records', callback);
};

exports._meta = {
  "version": 1
};
