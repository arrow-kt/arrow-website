import React from 'react';
import EnhancedSearch from 'enhancedocs-search';

import 'enhancedocs-search/dist/style.css';

export default function SearchBarWrapper(props) {
  return (
    <EnhancedSearch
      config={{
        enhancedSearch: {
          projectId: "6442ad83351c12aba70adc49",
          accessToken: "pk_6c67a49f78a72d32727881bc42733cbb9da115b85cc1b3d2"
        }
      }}
      {...props}
    />
  );
}
