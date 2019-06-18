import React from 'react';
import Header from '../../components/Header/Header';
import MapContainer from '../../components/MapContainer';
import MapFilter from '../../components/MapFilter/MapFilter';
import PropertyMapList from '../../components/Property/PropertyMapList/PropertyMapList';
import './mapPage.css';

const MapPage = () => (
  <section className="map-page">
    <Header />
    <MapFilter />
    <MapContainer globalMap />
    <PropertyMapList />
  </section>
);

export default MapPage;
