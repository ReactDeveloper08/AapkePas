// import firebase from '../../firebase/config';
import auth from '@react-native-firebase/auth';
const SignUpRequest = async (email, password) => {
  try {
    return await auth().createUserWithEmailAndPassword(email, password);
  } catch (error) {
    return error;
  }
};

export default SignUpRequest;
