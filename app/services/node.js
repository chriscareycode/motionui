import Ember from 'ember';

export default Ember.Service.extend({

  serverIp: '127.0.0.1',
  serverPort: '4300',

  getHostAndPort() {
    const serverIp = document.location.hostname;
    return serverIp + ':' + this.get('serverPort');
  }

});
