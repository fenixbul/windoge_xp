import React from 'react';
import cDriveIcon from 'assets/windowsIcons/290.png'; // replace with actual icons
import userDocumentsIcon from 'assets/windowsIcons/308(16x16).png';

const MyComputer = ({ navigateTo }) => {
  const items = [
    { label: '(C:)', icon: cDriveIcon, folder: 'C:' },
    { label: "User's Documents", icon: userDocumentsIcon, folder: 'Documents and Settings' }
  ];

  return (
    <div className="my-computer">
      <div className="com__content__right__card__content">
        {items.map((item, index) => (
          <div
            key={index}
            className="com__content__right__card__item"
            onClick={() => navigateTo(item.folder)}
          >
            <img src={item.icon} alt={item.label} className="com__content__right__card__img" />
            <div className="com__content__right__card__text">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyComputer;
