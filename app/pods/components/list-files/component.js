import Ember from 'ember';

export default Ember.Component.extend({

  // didInsertElement: function() {

  // }

  files: [],

  actions: {
    doDeleteAction: function(file) {
      //console.log('will delete file ' + file);
      this.doDelete(file);
    },
    doSaveAction: function(file) {
      //console.log('will delete file ' + file);
      this.doSave(file);
    }
  },

  doDelete(file) {

    const payload = { file: file };
    const files = this.get('files');

    Ember.$.ajax({
      url: 'http://10.69.0.25:4205/api/delete',
      type: 'POST',
      data: payload
    }).done(function(data) {
      console.log(data);

      // remove from DOM
      Ember.$('#div-' + file).remove();
      // remove from array
      files.removeObject(file);
      // files = files.filter(function(f) {
      //   return f !== file;
      // });

    }).fail(function(err) {
      console.log('fail', err);
    });

  },

  doSave(file) {

    const payload = { file: file };
    const files = this.get('files');

    Ember.$.ajax({
      url: 'http://10.69.0.25:4205/api/save',
      type: 'POST',
      data: payload
    }).done(function(data) {
      console.log(data);

      // remove from DOM
      Ember.$('#div-' + file).remove();
      // remove from array
      files.removeObject(file);
      // files = files.filter(function(f) {
      //   return f !== file;
      // });

    }).fail(function(err) {
      console.log('fail', err);
    });

  },

  didInsertElement() {
    console.log('new');
    let that = this;

    Ember.$.ajax({
      url: 'http://10.69.0.25:4205/api/files/list'
    }).done(function(data) {
      console.log(data);
      that.processFiles(data);
    }).fail(function(err) {
      console.log('fail', err);
    });
  },

  processFiles(data) {

    var re = /(?:\.([^.]+))?$/;
    var arr = [];

    if (data.files) {
      data.files.forEach(function(f) {


        var ext = re.exec(f)[1];   // "txt"


        if (ext === 'jpg') {
          //console.log(f);
          arr.push(f.slice(0, -4));
        }

      });

      arr = arr.sort(function(a, b) {
        if (a > b) { return -1; }
        if (a < b) { return 1; }
        return 0;
      });

      this.set('files', arr);
    }

  }

});
