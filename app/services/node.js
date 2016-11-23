import Ember from 'ember';

export default Ember.Service.extend({

  serverIp: '127.0.0.1',
  serverPort: '4300',

  getHostAndPortProperty: Ember.computed('document.location.hostname', function() {
    return this.getHostAndPort();
  }),

  getHostAndPort() {
    const serverIp = document.location.hostname;
    //const serverIp = 'pi2b';
    return serverIp + ':' + this.get('serverPort');
  }

});
