import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { FetchStatusEnum } from '../../models/response/FetchStatus';
import { IPostsState } from './types';
import { extraReducres } from './extraReducers';
import { IUser } from '../../models/IUser';
import { IPost } from '../../models/IPost';

const initialState: IPostsState = {
  uploadProgress: 0,
  activePost: {
    id: -1,
    title: '',
    text: '',
    image_set: [],
    tags: [],
    tagged_friends: [],
    audience: -1,
    fetched_images_id: [],
    custom_audience: -1,
    upload_progress: 0,
  },
  count: 0,
  posts: [],
  status: FetchStatusEnum.PENDING,
  errors: undefined,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setActivePostNull: (state) => {
      state.activePost = {
        id: -1,
        title: '',
        text: '',
        image_set: [],
        tags: [],
        tagged_friends: [],
        audience: -1,
        fetched_images_id: [],
        custom_audience: -1,
        upload_progress: 0,
      };
    },
    setPostToEdit: (state, action: PayloadAction<IPost>) => {
      state.editPost = action.payload;
      state.activePost = {
        upload_progress: 0,
        fetched_images_id: action.payload.image_set
          .filter((image) => image.id >= 0)
          .map((image) => image.id),
        ...action.payload,
      };
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.activePost.title = action.payload;
    },
    setText: (state, action: PayloadAction<string>) => {
      state.activePost.text = action.payload;
    },
    setAudience: (state, action: PayloadAction<number>) => {
      state.activePost.audience = action.payload;
    },
    setCustomAudience: (state, action: PayloadAction<number>) => {
      state.activePost.custom_audience = action.payload;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.activePost.tags = action.payload;
    },
    setFeeling: (state, action: PayloadAction<string | undefined>) => {
      state.activePost.feeling = action.payload;
    },
    addTaggedFriend: (state, action: PayloadAction<IUser>) => {
      state.activePost.tagged_friends = [...state.activePost.tagged_friends, action.payload];
    },
    removeTaggedFriend: (state, action: PayloadAction<number>) => {
      state.activePost.tagged_friends = state.activePost.tagged_friends.filter(
        (tagged_friend) => tagged_friend.id !== action.payload
      );
    },
  },
  extraReducers: extraReducres,
});

export const {
  setActivePostNull,
  setPostToEdit,
  setTitle,
  setText,
  setAudience,
  setCustomAudience,
  setTags,
  setUploadProgress,
  setFeeling,
  addTaggedFriend,
  removeTaggedFriend,
  // setIsEditing,
  // setNewPostAudience,
  // addImagesToNewPost,
  // removeImagesFromNewPost,
  // setNewPostNull,
  // setImageUploadProgress,
  // setUploadProgress,
  // addTaggedFriend,
  // removeTaggedFriend,
  // setTags,
  // setSelectedImage,
  // setNewPostImages,
  // setNewPost,
} = postsSlice.actions;

export default postsSlice.reducer;
