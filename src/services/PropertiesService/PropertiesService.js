export default class PropertiesService {
  setPropertyByType = (property, type) => {
    if (property && property.property_info) {
      const info = property.property_info;
      switch (type) {
        case 'address':
          const address = `${
            info.property_address_full
              ? `${info.property_address_full}, `
              : 'Empty address, '
          }${
            info.property_address_city
              ? info.property_address_city
              : 'Empty city'
          }${
            info.property_address_state
              ? `, ${info.property_address_state}`
              : ''
          }`;
          return address;
        case 'name':
          const name = `${info.legal_subdivision}`;
          return name;
        default:
      }
    }
    return 'Info empty';
  };
}
