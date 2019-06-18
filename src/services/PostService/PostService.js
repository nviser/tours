import AuthService from '../../services/AuthService/AuthService';
import ApiService from '../../services/ApiService/ApiService';

export default class PostService {
  AuthService = new AuthService();
  ApiService = new ApiService();

  prepareDataToSendPost = (
    comment,
    propertyId = 1,
    url,
    postTypeId,
    eventDate,
    data
  ) => {
    const user = this.AuthService.getProfile();
    const postData = {
      user_id: user.id,
      property_id: propertyId,
      content: comment,
      event_date: eventDate || new Date().toISOString(),
      post_type_id: postTypeId,
      ...data,
    };
    return this.ApiService.sendComponent(postData, url);
  };
}
