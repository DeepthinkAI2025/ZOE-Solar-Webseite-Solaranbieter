import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import StandortPage from '../components/StandortPage';
import { getServiceRegionBySlug, getServiceRegionSlug } from '../data/seoConfig';
import { localContentByCity } from '../data/localContent';

const isKnownLocationKey = (value: string): value is keyof typeof localContentByCity =>
  Object.prototype.hasOwnProperty.call(localContentByCity, value);

const StandortDynamicPage: React.FC = () => {
  const { city } = useParams<{ city: string }>();

  if (!city) {
    return <Navigate to="/" replace />;
  }

  const region = getServiceRegionBySlug(city);

  if (!region) {
    return <Navigate to="/" replace />;
  }

  const slug = getServiceRegionSlug(region);
  const locationKey = isKnownLocationKey(slug) ? slug : undefined;

  return (
    <StandortPage
      locationKey={locationKey}
      city={region.city}
      state={region.state}
      regionCode={region.regionCode}
      postalCode={region.postalCode}
      latitude={region.latitude}
      longitude={region.longitude}
      radiusKm={region.radiusKm}
    />
  );
};

export default StandortDynamicPage;
