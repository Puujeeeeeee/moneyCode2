'use client';
import React, { useEffect, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import HistoryIcon from '@mui/icons-material/History';
import { ImExit } from 'react-icons/im';
import Link from 'next/link';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const DashboardMenu = () => {
  const [currentPath, setCurrentPath] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const menuItems = [
    { href: '/home', icon: <HomeIcon />, label: 'Home' },
    { href: '/branchManagement', icon: <FolderIcon />, label: 'Branch' },
    {
      href: '/serviceManagement',
      icon: <CarRepairIcon />,
      label: 'Service',
    },
    { href: '/historyManagement', icon: <HistoryIcon />, label: 'Schedule' },
    {
      href: '/bookAppointmentManagement',
      icon: <ScheduleIcon />,
      label: 'Appointment',
    },
  ];

  return (
    <div className="relative">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white bg-blue-500 p-2 rounded-full focus:outline-none"
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`w-[340px] h-[100vh] bg-gradient-to-r from-[#023e8a] to-[#0077b6] from-10% to-90% p-6 fixed md:relative z-40 transition-transform transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-4 items-center">
            <div className="w-[150px] rounded-full bg-white h-[150px] ring-8 ring-from-[#03045e] ring-offset-teal-300 flex items-center justify-center">
              <div className="w-[140px] h-[140px] rounded-full bg-white "></div>
            </div>
            <Link
              href={'/userSettings'}
              className="flex items-center gap-2 text-white hover:underline cursor-pointer"
            >
              <h1 className="text-white text-[32px] font-semibold">Хэрэглэгч</h1>
              <CreateOutlinedIcon className="text-white" />
            </Link>
            <p className="text-white">purevsambuu@invescore.mn</p>
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`w-[280px] h-[45px] p-4 flex gap-4 items-center rounded-xl duration-100
                  ${
                    currentPath === item.href
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-black'
                  } 
                  hover:scale-100`}
              >
                {item.icon}
                <div>{item.label}</div>
              </Link>
            ))}
          </div>
          <div className="w-[100px] rounded-xl bg-gray-200 h-[45px] flex items-center p-4 gap-3 duration-200 cursor-pointer">
            <ImExit />
            <Link href={'/users'} className="font-semibold">
              Exit
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardMenu;
