import Ember from 'ember';

export default Ember.Component.extend({

  cameraSource: '',

  didInsertElement() {

    let camera = this.get('camera');
    let d = new Date();
    let src = '';
    switch(camera) {
      case 'infra':
        src = 'http://10.69.0.23:8081?'+d.getTime();
        break;
      case 'green2':
        src = 'http://10.69.0.27:8081?'+d.getTime();
        break;
      case 'green3':
        src = 'http://10.69.0.20:8081?'+d.getTime();
        break;
      case 'motion':
        src = 'http://10.69.0.26:8081?'+d.getTime();
        break;
      default:
        break;
    }
    this.set('cameraSource', src);

  }



});
