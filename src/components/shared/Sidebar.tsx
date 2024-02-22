import { useLocation, useNavigate } from 'react-router-dom';
import { buttons } from '../../buttons';
import SidebarButton from './SidebarButton';
const Sidebar = ({
  morePostOptions,
  openOptions,
  openMessages,
  changeBtn,
  activeButton,
  handleCloseCreate,
  username,
}: {
  username: string | null;
  morePostOptions: boolean;
  openOptions: boolean;
  openMessages: boolean;
  changeBtn: (arg0: string) => void;
  activeButton: string;
  handleCloseCreate: () => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div
      className={`flex flex-col items-start gap-6 w-full md:w-fit ${
        openOptions || morePostOptions
          ? 'bg-[rgba(0,0,0,0)]'
          : openMessages && 'bg-[rgba(0,0,0,0)]'
      }`}
    >
      {activeButton === 'search' ||
      activeButton === 'notifications' ||
      activeButton === 'messages' ? (
        <img
          onClick={() => navigate('/')}
          src='/insta-pics/black-insta.png'
          alt='Instagram Logo'
          className='cursor-pointer bg-no-repeat pb-4 mt-8 ml-4 w-[26px] hover:w-[28px] hover:pb-1.5 absolute opacity-0 xl:opacity-100 xl:static'
        />
      ) : (
        <img
          onClick={() => navigate('/')}
          src='/insta-pics/instagram.png'
          alt='Instagram Logo'
          className='cursor-pointer bg-no-repeat pb-2 mt-10 ml-5 w-[46%] h-[46%] absolute opacity-0 xl:opacity-100 xl:static'
        />
      )}
      <div className='w-full flex md:flex-col pt-4 md:pt-0 gap-y-4 md:gap-0.5 h-full justify-center items-end md:items-center lg:pr-5'>
        {buttons.map((button) => (
          <SidebarButton
            username={username}
            key={button.text}
            nonActiveImg={button.nonActiveImage}
            text={button.text}
            activeImg={button.activeImage}
            type={button.type}
            handleCloseCreate={handleCloseCreate}
            changeBtn={changeBtn}
            active={
              activeButton === button.text ||
              location.pathname.substring(1) === button.text
            }
            openOptions={openOptions}
            openMessages={openMessages}
            morePostOptions={morePostOptions}
          ></SidebarButton>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
