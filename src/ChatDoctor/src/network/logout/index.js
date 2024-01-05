// import firebase from '../../firebase/config';
import auth from '@react-native-firebase/auth';
const LogOutUser = async () => {
  try {
    return await auth().signOut();
  } catch (error) {
    return error;
  }
};

export default LogOutUser;
