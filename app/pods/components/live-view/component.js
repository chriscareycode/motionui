import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement() {
    console.log('didInsertElement');
    this.webcamTimerFired();
  },

  webcamTimerFired() {
        var d = new Date();
        Ember.$('#camera-infra').attr('src', 'http://10.69.0.23:8081?'+d.getTime()); // infra motion
        //$('#camera-infra').attr('src', 'http://10.69.0.23:8080/stream/video.mjpeg'); // infra uv4l
        Ember.$('#camera-green2').attr('src', 'http://10.69.0.27:8081?'+d.getTime()); // green2
        //$('#camera-green2').attr('src', 'http://10.69.0.27:8080/stream/video.mjpeg'); // green2 uv4l
        Ember.$('#camera-green3').attr('src', 'http://10.69.0.20:8081?'+d.getTime()); // green3
        //$('#camera-green3').attr('src', 'http://10.69.0.20:8080/stream/video.mjpeg'); // green3 uv4l
        //$('#camera-pi3').attr('src', 'http://pi3.local:8081?'+d.getTime()); // pi3
        Ember.$('#camera-motion').attr('src', 'http://10.69.0.26:8081?'+d.getTime()); // motion
        //$('#camera3').attr('src', 'http://10.69.1.12:8081?'+d.getTime()); // woody
        //$('#camera-white').attr('src', 'http://10.69.0.22:8081?'+d.getTime()); // white


  }

});
