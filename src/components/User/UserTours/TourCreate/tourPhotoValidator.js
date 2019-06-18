import { API_URL } from '../../../../config';

/**
 * Checks if tour background photo exists on a server.
 * Updates status only when needed, no need to send
 * https request for every key typing
 */
class TourPhotoValidator {
  isPhotoOnServerExists = false;

  check(tourId) {
    return new Promise((resolve, reject) => {
      const http = new XMLHttpRequest();
      http.open(
        'HEAD',
        `${API_URL}/routes/${tourId}/background?width=400`,
        false
      );
      http.send();
      this.isPhotoOnServerExists = http.status !== 404;
      // console.log('check photo on server', this.isPhotoOnServerExists);
      resolve(this.isPhotoOnServerExists);
    });
  }

  isPhotoExists = () => this.isPhotoOnServerExists;
}

const validator = new TourPhotoValidator();

export default validator;
