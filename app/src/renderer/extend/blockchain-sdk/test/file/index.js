var assert = require("assert");
var fileUtls = require("../../lib/file")

describe('file',function(){
  describe('createPrivFile',function(){    
    var filePaht = '/f.txt',pswd = '123456',addr = 'a',priv = '1';
    fileUtls.createPrivFile(filePaht,pswd,addr,priv);
  })
});
