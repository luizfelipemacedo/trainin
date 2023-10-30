import { decodedToken } from "./authentication";

/**
 * @description Retorna os dados do usuário obtidos do token
 * @returns {Promise<{id: string, email: string, picture: string, fullName: string}>}
 */
export async function getUserData() {
  const userMetaData = decodedToken();
  
  const id = userMetaData?.sub;
  const email = userMetaData?.email;
  const picture = userMetaData?.user_metadata?.picture;
  const fullName = userMetaData?.user_metadata?.full_name;
  
  const user = {
    id,
    email,
    picture,
    fullName,
  };
  
  return Object.freeze(user);
}
