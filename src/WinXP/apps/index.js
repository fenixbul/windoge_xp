import InternetExplorer from './InternetExplorer';
import Minesweeper from './Minesweeper';
import ErrorBox from './ErrorBox';
import MyComputer from './MyComputer';
import Notepad from './Notepad';
import Winamp from './Winamp';
import Paint from './Paint';
import iePaper from 'assets/windowsIcons/ie-paper.png';
import ie from 'assets/windowsIcons/ie.png';
import mine from 'assets/minesweeper/mine-icon.png';
import error from 'assets/windowsIcons/897(16x16).png';
import computer from 'assets/windowsIcons/676(16x16).png';
import computerLarge from 'assets/windowsIcons/676(32x32).png';
import notepad from 'assets/windowsIcons/327(16x16).png';
import notepadLarge from 'assets/windowsIcons/327(32x32).png';
import winamp from 'assets/windowsIcons/winamp.png';
import paintLarge from 'assets/windowsIcons/680(32x32).png';
import paint from 'assets/windowsIcons/680(16x16).png';
import ICPCoinsIcon from 'assets/customIcons/ICPCoinsIcon.png';
import ICPTokensIcon from 'assets/customIcons/ICPTokensIcon.png';
import puzzleExpressIcon from 'assets/customIcons/puzzleExpressIcon.png';
import Boxhead2PlayIcon from 'assets/customIcons/Boxhead2PlayIcon.png';
import quake3Arena from 'assets/customIcons/quake3Arena.png';
import Pinball3dIcon from 'assets/customIcons/Pinball3dIcon.png';
import solitaireIcon from 'assets/customIcons/solitaireIcon.png';
import windogeIcon from 'assets/customIcons/windogeIcon.png';
import ghostIcon from 'assets/customIcons/ghostIcon.png';
import exeIcon from 'assets/customIcons/exe.jpg';
import taggrIcon from 'assets/customIcons/taggrIcon.png';
import bitomniIcon from 'assets/customIcons/bitomniIcon.png';
import ND64Icon from 'assets/customIcons/ND64Icon.png';
import openChatIcon from 'assets/customIcons/openChatIcon.svg';
import twitterIcon from 'assets/customIcons/twitterIcon.png';
import trumpForceIcon from 'assets/customIcons/trumpForce.jpeg';
import ICPCoins from './ICPCoins';
import ICPTokens from './ICPTokens';
import PuzzleExpress from './PuzzleExpress';
import Pinball from './Pinball';
import Solitaire from './Solitaire';
import Boxhead from './Boxhead';
import Taggr from './Taggr';
import Quake3 from './Quake3';
import Bitomni from './Bitomni';
import TrumpForce from './TrumpForce';
import RetroEmulator from './RetroEmulator';
import Nintendoge64 from './Nintendoge64';

const gen = () => {
  let id = -1;
  return () => {
    id += 1;
    return id;
  };
};
const genId = gen();
const genIndex = gen();
export const defaultAppState = [
  // {
  //   component: InternetExplorer,
  //   header: {
  //     title: 'Internet Explorer',
  //     icon: iePaper,
  //   },
  //   defaultSize: {
  //     width: 700,
  //     height: 500,
  //   },
  //   defaultOffset: {
  //     x: 130,
  //     y: 20,
  //   },
  //   resizable: true,
  //   minimized: false,
  //   maximized: window.innerWidth < 800,
  //   id: genId(),
  //   zIndex: genIndex(),
  // },
  // {
  //   component: Minesweeper,
  //   header: {
  //     title: 'Minesweeper',
  //     icon: mine,
  //   },
  //   defaultSize: {
  //     width: 0,
  //     height: 0,
  //   },
  //   defaultOffset: {
  //     x: window.innerWidth < 800 ? 130 : 200,
  //     y: window.innerWidth < 800 ? 30 : 60,
  //   },
  //   resizable: false,
  //   minimized: false,
  //   maximized: false,
  //   id: genId(),
  //   zIndex: genIndex(),
  // },
  {
    component: Winamp,
    header: {
      title: 'Winamp',
      icon: winamp,
      invisible: true,
    },
    defaultSize: {
      width: 0,
      height: 0,
    },
    defaultOffset: {
      x: 0,
      y: 0
    },
    resizable: false,
    minimized: window.innerWidth < 800,
    maximized: false,
    id: genId(),
    zIndex: genIndex(),
  },
  // {
  //   component: MyComputer,
  //   header: {
  //     title: 'My Computer',
  //     icon: computer,
  //   },
  //   defaultSize: {
  //     width: 660,
  //     height: 500,
  //   },
  //   defaultOffset: {
  //     x: 250,
  //     y: 40,
  //   },
  //   resizable: true,
  //   minimized: false,
  //   maximized: window.innerWidth < 800,
  //   id: genId(),
  //   zIndex: genIndex(),
  // },
];

const defaultIconState = [];

defaultIconState.push(
  {
    id: 0,
    icon: computerLarge,
    title: 'My Computer',
    component: MyComputer,
    isFocus: false,
  },
  // {
  //   id: 1,
  //   icon: ICPCoinsIcon,
  //   title: 'ICPCoins',
  //   component: ICPCoins,
  //   isFocus: false,
  // },
  {
    id: 3,
    icon: ie,
    title: 'Internet Explorer',
    component: InternetExplorer,
    isFocus: false,
  },
  // {
  //   id: 30,
  //   icon: ie,
  //   title: 'RetroEmulator',
  //   component: RetroEmulator,
  //   isFocus: false,
  // },
  {
    id: 4,
    icon: notepadLarge,
    title: 'Roadmap',
    component: Notepad,
    isFocus: false,
  },
  {
    id: 5,
    icon: mine,
    title: 'Minesweeper',
    component: Minesweeper,
    isFocus: false,
  },
  {
    id: 19,
    icon: quake3Arena,
    title: 'Quake 3 Arena',
    component: Quake3,
    isFocus: false,
  },
  {
    id: 21,
    icon: trumpForceIcon,
    title: 'Trump Force',
    component: TrumpForce,
    isFocus: false,
  },
  {
    id: 7,
    icon: winamp,
    title: 'Winamp',
    component: Winamp,
    isFocus: false,
  },
  {
    id: 6,
    icon: Pinball3dIcon,
    title: 'Pinball',
    component: Pinball,
    isFocus: false,
  },
  {
    id: 9,
    icon: paintLarge,
    title: 'Paint',
    component: Paint,
    isFocus: false,
  },
  {
    id: 10,
    icon: openChatIcon,
    title: 'OpenChat',
    isFocus: false,
    link: "https://oc.app/community/myvs2-2yaaa-aaaar-a26tq-cai"
  },
  {
    id: 11,
    icon: taggrIcon,
    title: 'TAGGR',
    isFocus: false,
    component: Taggr
  },
  {
    id: 20,
    icon: bitomniIcon,
    title: 'Bitomni',
    isFocus: false,
    component: Bitomni
  },
  {
    id: 8,
    icon: windogeIcon,
    title: 'Buy XP',
    isFocus: false,
    link: "https://app.icpswap.com/swap?input=ryjl3-tyaaa-aaaaa-aaaba-cai&output=wqihv-qyaaa-aaaak-afjoa-cai"
  },
  {
    id: 12,
    icon: ghostIcon,
    title: 'Buy GHOST',
    isFocus: false,
    link: "https://app.icpswap.com/swap?input=ryjl3-tyaaa-aaaaa-aaaba-cai&output=4c4fd-caaaa-aaaaq-aaa3a-cai"
  },
  {
    id: 15,
    icon: exeIcon,
    title: 'Buy EXE',
    isFocus: false,
    link: "https://app.icpswap.com/swap?input=ryjl3-tyaaa-aaaaa-aaaba-cai&output=rh2pm-ryaaa-aaaan-qeniq-cai"
  },
  // {
  //   id: 13,
  //   icon: ICPTokensIcon,
  //   title: 'ICP Tokens',
  //   component: ICPTokens,
  //   isFocus: false,
  // },
  {
    id: 14,
    icon: twitterIcon,
    title: 'Twitter',
    isFocus: false,
    link: "https://twitter.com/_WindogeXP"
  },
  {
    id: 31,
    icon: ND64Icon,
    title: 'Nintendoge64',
    component: Nintendoge64,
    isFocus: false,
  },
  {
    id: 32,
    icon: ICPTokensIcon,
    title: 'ICP Tokens',
    component: ICPTokens,
    isFocus: false,
  },
);

// Find the index of the "Pinball" item
const pinballIndex = defaultIconState.findIndex(item => item.title === 'Pinball');

// If window width is greater than or equal to 800 pixels, insert "PuzzleExpress" after "Pinball"
if (window.innerWidth >= 800 && pinballIndex !== -1) {
  defaultIconState.splice(pinballIndex + 1, 0, {
    id: 17,
    icon: Boxhead2PlayIcon,
    title: 'Boxhead 2Play',
    component: Boxhead,
    isFocus: false,
  },);

  defaultIconState.splice(pinballIndex + 1, 0, {
    id: 16,
    icon: puzzleExpressIcon,
    title: 'PuzzleExpress',
    component: PuzzleExpress,
    isFocus: false,
  });

  defaultIconState.splice(pinballIndex + 1, 0, {
    id: 18,
    icon: solitaireIcon,
    title: 'Solitaire',
    component: Solitaire,
    isFocus: false,
  });
}

export { defaultIconState};

export const appSettings = {
  'Internet Explorer': {
    header: {
      icon: iePaper,
      title: 'InternetExplorer',
    },
    component: InternetExplorer,
    defaultSize: {
      width: 800,
      height: 600,
    },
    defaultOffset: {
      x: document.body.clientWidth / 2 - 400,
      y: 30,
    },
    resizable: true,
    minimized: false,
    maximized: window.innerWidth < 800,
    multiInstance: true,
  },
  // 'RetroEmulator': {
  //   header: {
  //     icon: iePaper,
  //     title: 'RetroEmulator',
  //   },
  //   component: RetroEmulator,
  //   defaultSize: {
  //     width: 640,
  //     height: 480,
  //   },
  //   defaultOffset: {
  //     x: document.body.clientWidth / 2 - 320,
  //     y: 30,
  //   },
  //   resizable: true,
  //   minimized: false,
  //   maximized: window.innerWidth < 700,
  //   multiInstance: true,
  // },
  Minesweeper: {
    header: {
      icon: mine,
      title: 'Minesweeper',
    },
    component: Minesweeper,
    defaultSize: {
      width: 0,
      height: 0,
    },
    defaultOffset: {
      x: document.body.clientWidth / 2 - 85,
      y: 180,
    },
    resizable: false,
    minimized: false,
    maximized: false,
    multiInstance: true,
  },
  Error: {
    header: {
      icon: error,
      title: 'C:\\',
      buttons: ['close'],
      noFooterWindow: true,
    },
    component: ErrorBox,
    defaultSize: {
      width: 380,
      height: 0,
    },
    defaultOffset: {
      x: window.innerWidth / 2 - 190,
      y: window.innerHeight / 2 - 60,
    },
    resizable: false,
    minimized: false,
    maximized: false,
    multiInstance: true,
  },
  'My Computer': {
    header: {
      icon: computer,
      title: 'My Computer',
    },
    component: MyComputer,
    defaultSize: {
      width: 660,
      height: 500,
    },
    defaultOffset: {
      x: 260,
      y: 50,
    },
    resizable: true,
    minimized: false,
    maximized: window.innerWidth < 800,
    multiInstance: false,
  },
  'ICP Tokens': {
    header: {
      icon: ICPTokensIcon,
      title: 'ICP Tokens',
    },
    component: ICPTokens,
    defaultSize: {
      width: 900,
      height: 700,
    },
    defaultOffset: {
      x: document.body.clientWidth / 2 - 450,
      y: 50,
    },
    resizable: true,
    minimized: false,
    maximized: window.innerWidth < 1000 || window.innerHeight < 800,
    multiInstance: false,
  },
  'Puzzle Express': {
    header: {
      icon: puzzleExpressIcon,
      title: 'Puzzle Express',
    },
    component: PuzzleExpress,
    defaultSize: {
      width: 852,
      height: 666,
    },
    defaultOffset: {
      x: 260,
      y: 50,
    },
    resizable: true,
    minimized: false,
    maximized: window.innerWidth < 800,
    multiInstance: false,
  },
  Boxhead: {
    header: {
      icon: Boxhead2PlayIcon,
      title: 'Boxhead 2Play',
    },
    component: Boxhead,
    defaultSize: {
      width: 775,
      height: 607,
    },
    defaultOffset: {
      x: document.body.clientWidth / 2 - 385,
      y: 50,
    },
    resizable: true,
    minimized: false,
    maximized: window.innerWidth < 800,
    multiInstance: false,
  },
  Pinball: {
    header: {
      icon: Pinball3dIcon,
      title: 'Pinball',
    },
    component: Pinball,
    defaultSize: {
      width: 742,
      height: 577,
    },
    defaultOffset: {
      x: document.body.clientWidth / 2 - 380,
      y: 50,
    },
    resizable: false,
    minimized: false,
    maximized: window.innerWidth < 800,
    multiInstance: false,
  },
  Solitaire: {
    header: {
      icon: solitaireIcon,
      title: 'Solitaire',
    },
    component: Solitaire,
    defaultSize: {
      width: 670,
      height: 493,
    },
    defaultOffset: {
      x: document.body.clientWidth / 2 - 335,
      y: 50,
    },
    resizable: false,
    minimized: false,
    maximized: window.innerWidth < 800,
    multiInstance: false,
  },
  Taggr: {
    header: {
      icon: taggrIcon,
      title: 'TAGGR',
    },
    component: Taggr,
    defaultSize: {
      width: document.body.clientWidth / 2,
      height: 600,
    },
    defaultOffset: {
      x: 0,
      y: 0,
    },
    resizable: !(window.innerWidth < 800),
    minimized: false,
    maximized: true,
    multiInstance: false,
  },
  Taggr: {
    header: {
      icon: taggrIcon,
      title: 'TAGGR',
    },
    component: Taggr,
    defaultSize: {
      width: document.body.clientWidth / 2,
      height: 600,
    },
    defaultOffset: {
      x: 0,
      y: 0,
    },
    resizable: !(window.innerWidth < 800),
    minimized: false,
    maximized: true,
    multiInstance: false,
  },
  Bitomni: {
    header: {
      icon: bitomniIcon,
      title: 'Bitomni',
    },
    component: Bitomni,
    defaultSize: {
      width: 1024,
      height: 768,
    },
    defaultOffset: {
      x: document.body.clientWidth / 2 - 512,
      y: 50,
    },
    resizable: true,
    minimized: false,
    maximized: window.innerWidth < 1024,
    multiInstance: false,
  },
  Nintendoge64: {
    header: {
      icon: ND64Icon,
      title: 'Nintendoge64',
    },
    component: Nintendoge64,
    defaultSize: {
      width: 1024,
      height: 768,
    },
    defaultOffset: {
      x: window.innerWidth < 1200 ? 0 :document.body.clientWidth - 1050,
      y: window.innerWidth < 1200 ? 0 : 20
    },
    resizable: true,
    minimized: false,
    maximized: window.innerWidth < 1200,
    multiInstance: false,
  },
  TrumpForce: {
    header: {
      icon: trumpForceIcon,
      title: 'Trump Force',
    },
    component: TrumpForce,
    defaultSize: {
      width: 1024,
      height: 768,
    },
    defaultOffset: {
      x: document.body.clientWidth / 2 - 512,
      y: 50,
    },
    resizable: false,
    minimized: false,
    maximized: true,
    multiInstance: false,
  },
  Quake3: {
    header: {
      icon: quake3Arena,
      title: 'Quake 3 Arena',
    },
    component: Quake3,
    defaultSize: {
      width: document.body.clientWidth / 2,
      height: 600,
    },
    defaultOffset: {
      x: 0,
      y: 0,
    },
    resizable: !(window.innerWidth < 800),
    minimized: false,
    maximized: true,
    multiInstance: false,
  },
  Notepad: {
    header: {
      icon: notepad,
      title: 'Roadmap - Notepad',
    },
    component: Notepad,
    defaultSize: {
      width: 500,
      height: 400,
    },
    defaultOffset: {
      x: 270,
      y: 60,
    },
    resizable: true,
    minimized: false,
    maximized: window.innerWidth < 800,
    multiInstance: true,
  },
  Winamp: {
    header: {
      icon: winamp,
      title: 'Winamp',
      invisible: true,
    },
    component: Winamp,
    defaultSize: {
      width: 0,
      height: 0,
    },
    defaultOffset: {
      x: 0,
      y: 0,
    },
    resizable: false,
    minimized: false,
    maximized: false,
    multiInstance: false,
  },
  Paint: {
    header: {
      icon: paint,
      title: 'Untitled - Paint',
    },
    component: Paint,
    defaultSize: {
      width: 660,
      height: 500,
    },
    defaultOffset: {
      x: 280,
      y: 70,
    },
    resizable: true,
    minimized: false,
    maximized: window.innerWidth < 800,
    multiInstance: true,
  },
};

export { InternetExplorer, Minesweeper, ErrorBox, MyComputer, Notepad, Winamp };
