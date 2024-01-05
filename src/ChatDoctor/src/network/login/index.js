// import firebase from '../../firebase/config';
import auth from '@react-native-firebase/auth';
const loginRequest = async (email, password) => {
  try {
    return await auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    return error;
  }
};

export default loginRequest;
