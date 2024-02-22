import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';

const RootLayout = ({
  openOptions,
  openMessages,
  token,
  changeBtn,
  activeButton,
  handleCloseCreate,
  setOpenOptions,
  morePostOptions,
  username,
}: {
  username: string | null;
  morePostOptions: boolean;
  setOpenOptions: (arg0: boolean) => void;
  openOptions: boolean;
  openMessages: boolean;
  token: undefined | string;
  changeBtn: (arg0: string) => void;
  activeButton: string;
  handleCloseCreate: () => void;
}) => {
  return (
    <>
      {token ? (
        <div className='flex w-full h-full'>
          <div
            onClick={() => {
              setOpenOptions(false);
            }}
            className={`fixed left-0 bottom-0 w-full md:w-fit bg-white max-[1024px]:z-20 ${
              openOptions
                ? 'bg-[rgba(0,0,0,0.65)] md:top-0 right-0 lg:pl-3 xl:w-[18.3%]'
                : 'xl:w-[17.5%] md:top-0 lg:left-3 md:border-r-[1px] md:border-gray-300'
            }`}
          >
            <Sidebar
              username={username}
              morePostOptions={morePostOptions}
              openOptions={openOptions}
              openMessages={openMessages}
              changeBtn={changeBtn}
              activeButton={activeButton}
              handleCloseCreate={handleCloseCreate}
            />
          </div>
          <div
            className={`w-full lg:w-[82%] xl:pl-1 static lg:absolute lg:top-0 lg:right-0 h-full`}
            onClick={handleCloseCreate}
          >
            <Outlet />
          </div>
        </div>
      ) : (
        <Navigate to='/sign-in' />
      )}
    </>
  );
};

export default RootLayout;
