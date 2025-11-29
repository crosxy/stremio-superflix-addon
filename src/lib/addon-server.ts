import { SuperFlixAddon } from './superflix-addon';
const addon = new SuperFlixAddon();

export const getManifest = () => addon.getManifest();
export const getCatalog = (t,id,e) => addon.getCatalog(t,id,e);
export const getMeta = (t,id) => addon.getMeta(t,id);
export const getStream = (t,id) => addon.getStream(t,id);
