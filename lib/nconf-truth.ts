/**
 * monkey patch nconf to support TRUE & FALSE on env & arg to port to bool
 */

import * as nconf from 'nconf';
const common = require('nconf/lib/nconf/common');

nconf.Env.prototype.loadEnv = function() {
  const self = this;

  this.readOnly = false;
  Object.keys(process.env)
    .filter(function(key) {
      if (self.match && self.whitelist.length) {
        return key.match(self.match) || self.whitelist.indexOf(key) !== -1;
      } else if (self.match) {
        return key.match(self.match);
      } else {
        return !self.whitelist.length || self.whitelist.indexOf(key) !== -1;
      }
    })
    .forEach(function(key) {
      let value: string | undefined | boolean = process.env[key];
      if (value === 'TRUE' || value === 'true') {
        value = true;
      } else if (value === 'FALSE' || value === 'false') {
        value = false;
      }

      if (self.separator) {
        self.set(common.key.apply(common, key.split(self.separator)), value);
      } else {
        self.set(key, value);
      }
    });

  this.readOnly = true;
  return this.store;
};
