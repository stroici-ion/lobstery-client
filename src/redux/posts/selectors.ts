import { RootState } from '..';

export const selectPosts = (state: RootState) => state.posts.posts;
export const selectActivePost = (state: RootState) => state.posts.activePost;
// export const selectPostById = (state: RootState, id: number) => state.posts.posts.find((post) => post.id === id);

export const selectPostById = (id: number) => (store: RootState) => store.posts.posts.filter(({ id }) => id === id)[0];
export const getIsDirty = (store: RootState) => {
  const p = store.posts.activePost;
  const a = store.audience;
  console.log(p.audience, a.default_audience);

  return (
    !!p.title ||
    !!p.text ||
    p.image_set.length ||
    !!p.feeling ||
    p.tags.length ||
    p.tagged_friends.length ||
    p.audience === a.default_audience
  );
};

//
