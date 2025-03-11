import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export interface Event {
  id: string;
  logo?: React.ReactNode;
  companyName: string;
  title: string;
  virtual: boolean;
  date: string;
  tags: string[];
  info: string;
  url: string;
  learnMoreFunction: () => void;
}

const getCompanyLogo = (companyName: string) => {
  switch (companyName.toLowerCase()) {
    case 'google':
      return React.createElement(FontAwesome, { name: "google", size: 24, color: "black" });
  }
};

export const DEFAULT_EVENTS: Omit<Event, 'learnMoreFunction'>[] = [
  {
    id: '1',
    companyName: 'Google',
    title: 'Connect with Google – Spring 2025 Edition',
    virtual: false,
    date: 'Tue, March 11',
    tags: ['Information Session', 'Hiring'],
    info: 'Northwestern University hosted a "Google Meet Up: Preparing and Practicing for Coding Interviews" event at the Ford Motor Company Engineering Design Center, The Hive, for students, post-docs, and graduate students.',
    url: 'https://app.joinhandshake.com/explore?company=google',
  },
//   {
//     id: '2',
//     companyName: 'Google',
//     title: 'Connect with Google – Spring 2025 Edition',
//     virtual: false,
//     date: 'Tue, March 11',
//     tags: ['Information Session', 'Hiring'],
//     info: 'Northwestern University hosted a "Google Meet Up: Preparing and Practicing for Coding Interviews" event at the Ford Motor Company Engineering Design Center, The Hive, for students, post-docs, and graduate students.',
//     url: 'https://app.joinhandshake.com/explore?company=google',
//   },
];

export const getEvents = (linkingFunction: (url: string) => void): Event[] => {
  return DEFAULT_EVENTS.map(event => ({
    ...event,
    logo: getCompanyLogo(event.companyName),
    learnMoreFunction: () => linkingFunction(event.url),
  }));
};
