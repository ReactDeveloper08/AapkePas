// import firebase from '../../firebase/config'; //web-app method
import auth from '@react-native-firebase/auth'; //app method
const loginRequest = async (email, password) => {
  try {
    return await auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    return error;
  }
};

export default loginRequest;
