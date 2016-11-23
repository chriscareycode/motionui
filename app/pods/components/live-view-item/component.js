import Ember from 'ember';

export default Ember.Component.extend({

  node: Ember.inject.service('node'),

  isMotionSupportsCommands: false,
  isDetectionStatusActive: false,

  actions: {
    cameraActivateAction: function() {
      const name = this.get('name');
      console.log('will activate on ' + name);

      this.cameraGetAction('start', (responseObject) => {
        if (responseObject.success) {
          console.log('got response success');
          console.log(responseObject);
        } else {
          console.log('got response failure');
          console.log(responseObject);
        }
        this.fetchConfig();
      });
    },

    cameraDeactivateAction: function() {
      const name = this.get('name');
      console.log('will deactivate on ' + name);

      this.cameraGetAction('pause', (responseObject) => {
        if (responseObject.success) {
          console.log('got response success');
          console.log(responseObject);
        } else {
          console.log('got response failure');
          console.log(responseObject);
        }
        this.fetchConfig();
      });
    }
  },

  cameraGetAction: function(action, callback) {

    const server = this.get('name');
    const hostAndPort = this.get('node').getHostAndPort();
    const url = 'http://' + hostAndPort + '/api/motion/command/' + server + '/0/detection/' + action;

    Ember.$.get(url, (responseObject) => {
      console.log('got responseObject ', responseObject);
      if (callback) { callback(responseObject); }
      // if (responseObject.success) {
      //   console.log('got response success');
      //   console.log(responseObject);

      // } else {
      //   console.log('got response failure');
      //   console.log(responseObject);
      // }
    });


  },

  cameraPostAction: function(action) {

    const server = this.get('name');
    const hostAndPort = this.get('node').getHostAndPort();
    const url = 'http://' + hostAndPort + '/api/motion/command/' + server + '/0/detection/status';
    const postdata = {
      one: '1',
      two: '2'
    };
    Ember.$.post(url, postdata, (responseObject) => {
      console.log('got responseObject ', responseObject);

      if (responseObject.success) {
        console.log('got response success');
        console.log(responseObject);

      } else {
        console.log('got response failure');
        console.log(responseObject);
      }
    });


  },

  didInsertElement: function() {
    setTimeout(() => {
      this.fetchConfig();
    }, 100);
  },

  // fetch infra:8080/config/list
  fetchConfig: function() {
    console.log('fetchConfig');

    const server = this.get('name');
    const hostAndPort = this.get('node').getHostAndPort();
    const url = 'http://' + hostAndPort + '/api/motion/command/' + server + '/0/detection/status';
    Ember.$.get(url, (responseObject) => {
      console.log('got responseObject ', responseObject);

      if (responseObject.success) {

        this.set('isMotionSupportsCommands', true);

        if (responseObject.body.indexOf('Detection status ACTIVE') !== -1) {
          this.set('isDetectionStatusActive', true);
        } else {
          this.set('isDetectionStatusActive', false);
        }
      } else {
        console.log('got response failure')
      }
    });
  }

});
