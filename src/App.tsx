// App.js
import { Route, Routes, useLocation } from 'react-router-dom';
import AuthLayout from './_auth/AuthLayout';
import SignInForm from './_auth/forms/SignInForm';
import SignUpForm from './_auth/forms/SignUpForm';
import RootLayout from './_root/RootLayout';
import {
  Home,
  Explore,
  Create,
  Notifications,
  Profile,
  More,
  Search,
  Reels,
  Messages,
  Text,
  EditAccount,
} from './_root/pages';
import { useState, useEffect } from 'react';
import { buttons } from './buttons';
import NewMessage from './components/shared/NewMessage';
import { getUsername } from './config/api';
import ChangeAccount from './components/shared/ChangeAccount';
import { ImageObject } from './components/shared/PostDetails';
import Comment from './components/shared/Comment';
import { CommentType } from './components/shared/Comment';
import MorePostOptions from './components/shared/MorePostOptions';
import CreateProfile from './components/shared/CreateProfile';
import Following from './components/shared/Following';
import Followed from './components/shared/Followed';
import CreatePost from './components/shared/CreatePost';
import Loader from './components/shared/Loader';

const App = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [activeButton, setActiveButton] = useState('');
  const [activePage, setActivePage] = useState('');
  const [username, setUsername] = useState('');
  const [openMessages, setOpenMessages] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [userEmail, setUserEmail] = useState<string | undefined>('');

  const [likesCount, setLikesCount] = useState<{ [postId: string]: number }>(
    {}
  );
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [selectedPost, setSelectedPost] = useState<ImageObject | null>(null);
  const [morePostOptions, setMorePostOptions] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [openFollowers, setOpenFollowers] = useState(false);
  const [openFollowed, setOpenFollowed] = useState(false);
  const [followingNumber, setFollowingNumber] = useState(0);
  const [followedNumber, setFollowedNumber] = useState(0);
  const [post, setPost] = useState<boolean>(false);
  const [postItem, setPostItem] = useState<{
    creator: string;
    imageUrl: string;
  } | null>(null);
  const user = username;

  const handleOpenComments = (post: ImageObject) => {
    setSelectedPost(post);
    setOpenComments(true);
  };
  const handleCloseComments = () => {
    setSelectedPost(null);
    setOpenComments(false);
  };

  if (token) {
    sessionStorage.setItem('token', JSON.stringify(token));
  }

  useEffect(() => {
    const tokenData = sessionStorage.getItem('token');
    if (tokenData) {
      const data = JSON.parse(tokenData);
      setToken(data);
      setUserEmail(token);
    }
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUsername(userEmail);
        setUsername(data?.at(0)?.username);
        if (username) {
          sessionStorage.setItem('username', username);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userEmail, username]);

  useEffect(() => {
    // Initialize the activeButton and activePage based on the current location
    const currentPath = location.pathname.substring(1).split('/').toString();
    const button = buttons.find((btn) => btn.text === currentPath);

    if (button) {
      setActiveButton(button.text);
      if (button.type === 'page') {
        setActivePage(button.text);
      }
    }
  }, [location.pathname]);

  const changeBtn = (button: string) => {
    if (button === activeButton && activePage !== '') {
      // If the same button is clicked again, close the component and go back to the pr.evious page
      setActivePage('');
    } else {
      setActiveButton(button);
      const buttonType = buttons.find((btn) => btn.text === button)?.type;
      if (buttonType === 'page') {
        setActivePage(button);
      }
    }
  };

  const handleCloseCreate = () => {
    setTimeout(() => {
      setActiveButton(activePage);
    }, 0);
  };

  if (loading)
    return (
      <div className='w-full h-full flex'>
        <Loader />
      </div>
    );

  return (
    <main
      className={`${
        openOptions
          ? 'bg-[rgba(0,0,0,0.65)]'
          : openMessages || (openComments && 'bg-[rgba(0,0,0,0)]')
      }`}
    >
      <Routes>
        <Route element={<AuthLayout token={token} />}>
          <Route path='/sign-up' element={<SignUpForm />} />
          <Route path='/sign-in' element={<SignInForm setToken={setToken} />} />
        </Route>
        <Route
          element={
            <RootLayout
              username={user}
              setOpenOptions={setOpenOptions}
              openOptions={openOptions}
              morePostOptions={morePostOptions}
              openMessages={openMessages}
              token={token}
              changeBtn={changeBtn}
              activeButton={activeButton}
              handleCloseCreate={handleCloseCreate}
            />
          }
        >
          <Route
            index
            element={
              <Home
                likesCount={likesCount}
                setLikesCount={setLikesCount}
                likedPosts={likedPosts}
                setLikedPosts={setLikedPosts}
                savedPosts={savedPosts}
                setSavedPosts={setSavedPosts}
                openComments={openComments}
                onOpenComments={handleOpenComments}
                setOpenLogin={setOpenLogin}
                email={userEmail}
                open={openOptions}
                setOpen={setOpenOptions}
                username={username}
              />
            }
          />
          <Route
            path='/explore'
            element={
              <Explore
                changeBtn={changeBtn}
                handleOpenComments={handleOpenComments}
                username={username}
              />
            }
          />
          <Route
            path='/reels'
            element={
              <Reels
                likesCount={likesCount}
                setLikesCount={setLikesCount}
                likedPosts={likedPosts}
                setLikedPosts={setLikedPosts}
                savedPosts={savedPosts}
                setSavedPosts={setSavedPosts}
                openComments={openComments}
                handleOpenComments={handleOpenComments}
                username={username}
              />
            }
          />
          <Route
            path='/messages'
            element={
              <Messages
                setOpenLogin={setOpenLogin}
                username={username}
                setOpen={setOpenMessages}
              />
            }
          />
          <Route
            path='/messages/:receiver'
            element={
              <Text
                setOpenLogin={setOpenLogin}
                username={username}
                setOpen={setOpenMessages}
              />
            }
          />
          <Route
            path={`/:user`}
            element={
              <Profile
                setOpenLogin={setOpenLogin}
                setToken={setToken}
                followingNumber={followingNumber}
                setFollowingNumber={setFollowingNumber}
                setFollowedNumber={setFollowedNumber}
                followedNumber={followedNumber}
                setOpenFollowed={setOpenFollowed}
                setOpenFollowers={setOpenFollowers}
                setOpenCreate={setOpenCreate}
                handleOpenComments={handleOpenComments}
                username={username}
                changeBtn={changeBtn}
              />
            }
          />
          <Route
            path={`:user/saved`}
            element={
              <Profile
                setOpenLogin={setOpenLogin}
                setToken={setToken}
                followingNumber={followingNumber}
                setFollowingNumber={setFollowingNumber}
                setFollowedNumber={setFollowedNumber}
                followedNumber={followedNumber}
                setOpenFollowed={setOpenFollowed}
                setOpenFollowers={setOpenFollowers}
                setOpenCreate={setOpenCreate}
                handleOpenComments={handleOpenComments}
                username={username}
                changeBtn={changeBtn}
              />
            }
          />
          <Route
            path={`:user/tagged`}
            element={
              <Profile
                setOpenLogin={setOpenLogin}
                setToken={setToken}
                followingNumber={followingNumber}
                setFollowingNumber={setFollowingNumber}
                setFollowedNumber={setFollowedNumber}
                followedNumber={followedNumber}
                setOpenFollowed={setOpenFollowed}
                setOpenFollowers={setOpenFollowers}
                setOpenCreate={setOpenCreate}
                handleOpenComments={handleOpenComments}
                username={username}
                changeBtn={changeBtn}
              />
            }
          />
          <Route
            path='/edit-account'
            element={<EditAccount username={username} />}
          ></Route>
        </Route>
      </Routes>
      {token ? (
        <>
          {activeButton === 'search' && (
            <Search changeBtn={handleCloseCreate} />
          )}
          {activeButton === 'notifications' && <Notifications />}
          {activeButton === 'create' && (
            <Create
              username={username}
              changeBtn={handleCloseCreate}
              setPost={setPost}
              setPostItem={setPostItem}
            />
          )}
          {activeButton === 'more' && (
            <More
              user={username}
              setOpenLogin={setOpenLogin}
              setToken={setToken}
              changeBtn={handleCloseCreate}
            />
          )}
          {post && (
            <CreatePost
              changeBtn={changeBtn}
              post={post}
              postItem={postItem}
              setPostItem={setPostItem}
              setPost={setPost}
            />
          )}
        </>
      ) : null}
      {openMessages && (
        <NewMessage setOpen={setOpenMessages} email={userEmail} />
      )}
      {openLogin && (
        <ChangeAccount setToken={setToken} setOpen={setOpenLogin} />
      )}
      {openComments && (
        <Comment
          comments={comments}
          setComments={setComments}
          username={username}
          setLikesCount={setLikesCount}
          setLikedPosts={setLikedPosts}
          setSavedPosts={setSavedPosts}
          setOpen={setMorePostOptions}
          likedPosts={likedPosts}
          likesCount={likesCount}
          savedPosts={savedPosts}
          selectedPost={selectedPost}
          onCloseComments={handleCloseComments}
        />
      )}
      {morePostOptions && <MorePostOptions setOpen={setMorePostOptions} />}
      {openCreate && (
        <CreateProfile
          username={username}
          changeBtn={changeBtn}
          setOpenCreate={setOpenCreate}
        />
      )}
      {openFollowers && (
        <Following
          username={location.pathname.substring(1)}
          setOpen={setOpenFollowers}
          followingNumber={followingNumber}
          setFollowingNumber={setFollowingNumber}
        />
      )}
      {openFollowed && (
        <Followed
          followingNumber={followingNumber}
          setFollowingNumber={setFollowingNumber}
          username={username}
          setOpen={setOpenFollowed}
        />
      )}
    </main>
  );
};

export default App;
