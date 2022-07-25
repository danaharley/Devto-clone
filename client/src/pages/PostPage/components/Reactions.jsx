import tw, { styled } from 'twin.macro';
import { useEffect } from 'react';
import useScroll from '../../../hooks/useScroll';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, setAuthModal } from '../../../core/features/auth/authSlice';
import LikePost from './LikePost';
import UnicornPost from './UnicornPost';
import BookmarkPost from './BookmarkPost';
import usePostReaction from '../hooks/usePostReaction';

const Reactions = ({ post }) => {
  const { scrollDirection } = useScroll();
  const { username } = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const { _id, author, likes, unicorns, bookmarks } = post;
  const likesArr = [...likes];
  const unicornsArr = [...unicorns];
  const bookmarksArr = [...bookmarks];
  const { state, handleReaction } = usePostReaction(
    _id,
    author,
    likesArr,
    unicornsArr,
    bookmarksArr
  );
  const { isLiked, isUnicorned, isBookmarked } = state;

  return (
    <Wrapper scrollDirection={scrollDirection}>
      <Content>
        <LikePost
          likes={likesArr}
          isLiked={isLiked}
          handleReaction={handleReaction}
          setAuthModal={setAuthModal}
        />
        <UnicornPost
          unicorns={unicornsArr}
          isUnicorned={isUnicorned}
          handleReaction={handleReaction}
          setAuthModal={setAuthModal}
        />
        <BookmarkPost
          bookmarks={bookmarksArr}
          isBookmarked={isBookmarked}
          handleReaction={handleReaction}
          setAuthModal={setAuthModal}
        />
        {author.username === username && (
          <EditButton onClick={() => navigate('edit')}>Edit</EditButton>
        )}
      </Content>
    </Wrapper>
  );
};

const EditButton = tw.button`w-full rounded-md text-sm border border-solid p-1 bg-dark-gray text-white hover:(text-dark-gray bg-white border-dark-gray) mob:w-lg`;

const Wrapper = styled.div`
  ${({ scrollDirection }) =>
    scrollDirection === 'up' ? `bottom: -100% !important;` : `bottom: 0 !important;`}

  ${tw`w-20 text-2xl flex flex-col items-center gap-sm mt-lg mob:(fixed bottom-0 left-0 bg-white w-full px-lg pt-sm)`}
`;

const Content = tw.div`fixed mob:(static flex items-center justify-between w-full)`;

export default Reactions;
