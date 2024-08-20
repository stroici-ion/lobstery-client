import $api from '../http';

export const fetchDefaultAudience = async (user: number) => {
  try {
    const { data } = await $api.get<{ default_audience: number; default_custom_audience: number }>(
      `api/profiles/${user}/audience/`
    );
    return data;
  } catch (e) {
    console.error(e);
  }
};
