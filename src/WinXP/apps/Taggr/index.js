import React from 'react';
import styled from 'styled-components';

const TaggrWrap = styled.div`
`;

function Taggr({ onClose, onMinimize }) {
  return (
    <TaggrWrap>
      <iframe
        frameBorder="0" // Note the camelCase here
        src="https://taggr.link/"
        title="TAGGR"
        width="100%"
        style={{ border: 'none', height: '100vh' }}
      ></iframe>
    </TaggrWrap>
  );
}

export default Taggr;
