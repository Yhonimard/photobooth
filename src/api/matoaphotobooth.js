import request from "./handler";

const background = async () => {
  const { data } = await request.get("/settings-default");
  return data;
};

const frame = async () => {
  const { data } = await request.get("/frame");
  return data;
};

const color = async () => {
  const { data } = await request.get("/color");
  return data;
};

const voucher = async () => {
  const { data } = await request.get("/voucher");
  return data;
};

const saveInfo = async form => {
  const { data } = await request.post("/list-contact", form);
  return data;
};

const uploadImage = async form => {
  const { data } = await request.post("/send-image", form)
  return data
};
//
const createTr = async (params = {}) => {
  const { data } = await request.post("/open/slide", params);
  return data;
};
const checkTr = async (params = {}) => {
  const { data } = await request.post("/check-transaction", params);
  return data;
};
const checkCb = async (id) => {
  if (!id) return;
  const { data } = await request.get("/callback/" + id);
  return data;
};
export default {
  background,
  frame,
  color,
  voucher,
  saveInfo,
  uploadImage,
  // 
  createTr,
  checkTr,
  checkCb
};
