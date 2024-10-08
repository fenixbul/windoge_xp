import React from 'react';

const Breadcrumb = ({ currentPath, goBackTo }) => {
  return (
    <div className="breadcrumb">
      {currentPath.map((folder, index) => (
        <span key={index} onClick={() => goBackTo(index)} className="breadcrumb-item">
          {folder}
          {index < currentPath.length - 1 && ' > '}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;
