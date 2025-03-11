import axios from 'axios';

const ENDPOINT = 'https://659f86b15023b02bfe89c737.mockapi.io';

const DepartmentService = {
  DepartmentCarousel: async () => {
    const url = `${ENDPOINT}/api/v1/departments`;
    try {
      const response = await axios.get(url);
      return response;
    } catch (error) {
      console.log('Error API DepartmentCarousel', error);
    }
  },
  ProductListing: async (departmentId: string) => {
    const url = `${ENDPOINT}/api/v1/departments/${departmentId}/products`;
    try {
      const response = await axios.get(url);
      return response;
    } catch (error) {
      console.log('Error API DepartmentCarousel', error);
    }
  },
};
export default DepartmentService;
