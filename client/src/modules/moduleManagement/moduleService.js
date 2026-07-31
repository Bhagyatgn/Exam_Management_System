import * as moduleApi from './moduleApi.js';

export const fetchAllModules = async () => {
  const response = await moduleApi.getModules();
  return response.data;
};

export const createNewModule = async (data) => {
  const response = await moduleApi.createModule(data);
  return response.data;
};

export const editModule = async (id, data) => {
  const response = await moduleApi.updateModule(id, data);
  return response.data;
};

export const removeModule = async (id) => {
  await moduleApi.deleteModule(id);
};
