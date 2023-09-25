import { decodedToken } from "./authentication";

const userMetaData = decodedToken();

const userID = userMetaData?.sub;
const userEmail = userMetaData?.email;
const userPicture = userMetaData?.user_metadata?.picture;
const userFullName = userMetaData?.user_metadata?.full_name;

const user = {
  id: userID,
  email: userEmail,
  picture: userPicture,
  fullName: userFullName,
};

export default Object.freeze(user);
