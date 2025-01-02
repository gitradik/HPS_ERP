import axios from 'src/utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import { map } from 'lodash';
import { AppDispatch } from 'src/store/Store';

const API_URL = '/api/data/postData';

interface StateType {
  posts: any[];
  followers: any[];
  gallery: any[];
}

const initialState = {
  posts: [],
  followers: [],
  gallery: [],
};

export const UserProfileSlice = createSlice({
  name: 'UserPost',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setFollowers: (state, action) => {
      state.followers = action.payload;
    },
    setPhotos: (state, action) => {
      state.gallery = action.payload;
    },
    onToggleFollow(state: StateType, action) {
      const followerId = action.payload;

      const handleToggle = map(state.followers, (follower) => {
        if (follower.id === followerId) {
          return {
            ...follower,
            isFollowed: !follower.isFollowed,
          };
        }

        return follower;
      });

      state.followers = handleToggle;
    },
  },
});

export const { setPosts, setFollowers, onToggleFollow, setPhotos } = UserProfileSlice.actions;

export const fetchPosts = () => async (dispatch: AppDispatch) => {
  try {
    // const response = await axios.get(`${API_URL}`);
    // dispatch(setPosts(response.data));
    dispatch(setPosts([]));
  } catch (err: any) {
    throw new Error(err);
  }
};
export const likePosts = (postId: number) => async (dispatch: AppDispatch) => {
  try {
    // const response = await axios.post('/api/data/posts/like', { postId });
    // dispatch(setPosts(response.data.posts));
    dispatch(setPosts([]));
  } catch (err: any) {
    throw new Error(err);
  }
};
export const addComment = (postId: number, comment: any[]) => async (dispatch: AppDispatch) => {
  try {
    // const response = await axios.post('/api/data/posts/comments/add', { postId, comment });
    // dispatch(setPosts(response.data.posts));
    dispatch(setPosts([]));
  } catch (err: any) {
    throw new Error(err);
  }
};

export const addReply =
  (postId: number, commentId: any[], reply: any[]) => async (dispatch: AppDispatch) => {
    try {
      // const response = await axios.post('/api/data/posts/replies/add', {
      //   postId,
      //   commentId,
      //   reply,
      // });
      // dispatch(setPosts(response.data.posts));
      dispatch(setPosts([]));
    } catch (err: any) {
      throw new Error(err);
    }
  };

export const fetchFollwores = () => async (dispatch: AppDispatch) => {
  try {
    // const response = await axios.get(`/api/data/users`);
    // dispatch(setFollowers(response.data));
    dispatch(setFollowers([]));
  } catch (err: any) {
    throw new Error(err);
  }
};

export const fetchPhotos = () => async (dispatch: AppDispatch) => {
  try {
    // const response = await axios.get(`/api/data/gallery`);
    // dispatch(setPhotos(response.data));
    dispatch(setPhotos([]));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default UserProfileSlice.reducer;
