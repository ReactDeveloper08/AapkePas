import {createStackNavigator} from 'react-navigation-stack';
import {createSwitchNavigator} from 'react-navigation';

// Login Screens
import LoginScreen from '../clientScreens/LoginScreen';
import OTPScreen from '../clientScreens/OTPScreen';
import SignUpScreen from '../clientScreens/SignUpScreen';
import RegOTPScreen from '../clientScreens/RegOTPScreen';
import ForgetPassword from '../clientScreens/ForgatePassword';
// import TermsCondition from '../screens/TermsCondition';

// Home Screens
import HomeScreen from '../clientScreens/HomeScreen';
import ExamScreen from '../clientScreens/ExamScreen';
import ResultScreen from '../clientScreens/ResultScreen';
import HomeCategoryDetail from '../clientScreens/HomeCategoryDetail';
import ExpertsQuestionsScreen from '../clientScreens/ExpertsQuestionsScreen';
import ExpertDetailScreen from '../clientScreens/ExpertDetailScreen';
import ThankyouScreen from '../clientScreens/ThankyouScreen';
import Orders from '../clientScreens/Orders';
// Wallet Screen
import WalletScreen from '../clientScreens/WalletScreen';
import WalletPassbook from '../clientScreens/WalletPassbook';
// import WalletExpense from '../screens/WalletExpense';
// import WalletIncome from '../screens/WalletIncome';
import WalletHistory from '../clientScreens/WalletHistory';
import Coupons from '../clientScreens/Coupons';

// Chat Screens
import {
  Chat,
  callHistory,
  chatHistory,
  ShowFullImg,
} from '../Chat_WiseWord/src/container';
import AllSetChatPopup from '../clientScreens/ExpertDetailScreen/AllSetChatPopup';
import AllSetVideoCallPopup from '../clientScreens/ExpertDetailScreen/AllSetVideoCallPopup';

//Live Stream
import Live_Customer from '../Live';
import Customer_Viewer from '../Live/Viewer';
// import Customer_Viewer from '../Live/Viewer_ag';

//Video Call
import VideoScreen from '../Video/vcClient/VideoCallScreen';

// Experts Screen
import ExpertsListScreen from '../clientScreens/ExpertsListScreen';

// My Account Screens
import MyAccountScreen from '../clientScreens/MyAccountScreen';
import ProfileScreen from '../clientScreens/ProfileScreen';
import EditProfileScreen from '../clientScreens/EditProfileScreen';
import MyPaymentsScreen from '../clientScreens/MyPaymentsScreen';
import MyExpertsScreen from '../clientScreens/MyExpertsScreen';
import MyExpertsDetailScreen from '../clientScreens/MyExpertsDetailScreen';
import ReviewScreen from '../clientScreens/ReviewScreen';
import FAQScreen from '../clientScreens/FAQScreen';
import QuestionListSCreen from '../clientScreens/QuestionListSCreen';
import FaqQuestionDetail from '../clientScreens/FaqQuestionDetail';
import PrivacyPolicies from 'components/PrivacyPolicies';
import TermsCondition from 'components/TermsCondition';

// Live Screen
// import Lives from '../screens/LiveScreen';
//Explore Screen
import ExploreScreen from '../clientScreens/ExploreScreen';
// google login
// import GoogleLogin from '../screens/GoogleLogin';

// Notification
import Notification from '../clientScreens/Notification';

//* Video Call Screen
import {vcClient, vcDoc, vcPopup} from '../Video/index';

//* interNet Call Screens
import {callClient, callDoc, callPopUp} from '../Audio/index';

//* Doctor side navigation

import Home_Screen from 'DoctorSide/HomeScreen';
import TotalPaymentScreen from 'DoctorSide/TotalPaymentScreen';
import FollowingScreen from 'DoctorSide/FollowingScreen';
import StatusCheckScreen from 'DoctorSide/StatusCheckScreen';
import OperationLogbookScreen from 'DoctorSide/OperationLogbookScreen';
import AstrologerProfileScreen from 'DoctorSide/AstrologerProfileScreen';
import AstroPostScreens from 'DoctorSide/AstroPostScreens';
import LiveScreen from 'DoctorSide/LiveScreen';
import writePostScreen from 'DoctorSide/writePostScreen';
import MyPostsScreen from 'DoctorSide/MyPostsScreen';
import MyMomentsScreen from 'DoctorSide/MyMomentsScreen';
import OrderHistoryScreen from 'DoctorSide/OrderHistoryScreen';
import LiveOrderScreen from 'DoctorSide/LiveOrderScreen';
import PranamGurujiOfficialScreen from 'DoctorSide/PranamGurujiOfficialScreen';
import ShortCutScreen from 'DoctorSide/ShortCutScreen';
import BlockListScreen from 'DoctorSide/BlockListScreen';
import SettingScreen from 'DoctorSide/SettingScreen';
import ContactScreen from 'DoctorSide/ContactScreen';
import PrivacyPolicyScreen from 'DoctorSide/PrivacyPolicyScreen';
import TermsConditionsScreen from 'DoctorSide/TermsConditionsScreen';
import ChatListScreen from 'DoctorSide/ChatListScreen';
import Broadcaster from '../LiveBroadCaster/Broadcaster';
import StartChat from 'ChatDoctor';
import CallConfirmScreen from 'ChatDoctor/src/container/CallConfirmScreen';
import Doc_Chat from 'ChatDoctor/src/container/chat/index';
import OrderMissedTab from 'tabs/OrderMissedTab';
import astro_dashboard from 'ChatDoctor/src/container/dashboard';
import call_History from 'ChatDoctor/src/container/callHistory';
import chat_History from 'ChatDoctor/src/container/chatHistory';
import show_FullImg from 'ChatDoctor/src/container/showFullImg';
import EndLive from '../LiveBroadCaster/EndLive';

const RegistrationNavigator = createStackNavigator(
  {
    Login: LoginScreen,
    ForgetPassword: ForgetPassword,
    // GoogleLogin: GoogleLogin,
    OTP: OTPScreen,
    SignUp: SignUpScreen,
    RegOtp: RegOTPScreen,
    Terms: TermsCondition,
  },
  {
    initialRouteName: 'Login',
    mode: 'modal',
    headerMode: 'none',
  },
);

const MyWalletNavigator = createStackNavigator(
  {
    Vault: WalletScreen,
    WalletHistory: WalletHistory,
    Passbook: WalletPassbook,
    Coupon: Coupons,
  },
  {
    initialRouteName: 'Vault',
    mode: 'modal',
    headerMode: 'none',
  },
);

const LoggedOutNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Exam: ExamScreen,
    Result: ResultScreen,
    ExploreScreen: ExploreScreen,
    HomeCategory: HomeCategoryDetail,
    ExpertsList: ExpertsListScreen,
    ExpertDetail: ExpertDetailScreen,
    Lives: Live_Customer,
    Customer_Viewer: Customer_Viewer,
    Login: RegistrationNavigator,
    Thankyou: ThankyouScreen,
    // Orders: OrdersNavigator,
  },
  {
    initialRouteName: 'Home',
    mode: 'modal',
    headerMode: 'none',
    detachInactiveScreens: true,
    navigationOptions: {
      detachPreviousScreen: true,
    },
  },
);

const LoggedInNavigator = createStackNavigator(
  {
    // Home: HomeNavigator,
    Homes: HomeScreen,
    Exam: ExamScreen,
    Result: ResultScreen,
    ExploreScreen: ExploreScreen,
    Notification: Notification,
    HomeCategory: HomeCategoryDetail,
    ExpertsList: ExpertsListScreen,
    ExpertDetail: ExpertDetailScreen,
    Thankyou: ThankyouScreen,
    // Experts: ExpertsNavigator,
    Questions: ExpertsQuestionsScreen,
    Lives: Live_Customer,
    Customer_Viewer: Customer_Viewer,
    Chat: Chat,
    callHistory: callHistory,
    chatHistory: chatHistory,
    ShowFullImg: ShowFullImg,
    vcClient: vcClient,
    callClient: callClient,
    Orders: Orders,
    AllSetChatPopup: AllSetChatPopup,
    AllSetVideoCallPopup: AllSetVideoCallPopup,
    VideoCall: VideoScreen,
    // Appointment: AppointmentScreen,
    Wallet: MyWalletNavigator,
    // MyAccount: MyAccountNavigator,
    MyAccount: MyAccountScreen,
    Profile: ProfileScreen,
    EditProfile: EditProfileScreen,
    MyWallet: MyWalletNavigator,
    Coupons: Coupons,
    AddMoney: WalletScreen,
    //Passbook: WalletPassbook,
    // MyConsultation: MyConsultationNavigator,
    MyExperts: MyExpertsScreen,
    MyExpertsDetail: MyExpertsDetailScreen,
    FAQ: FAQScreen,
    QuestionList: QuestionListSCreen,
    FaqQuestionDetail: FaqQuestionDetail,
    PrivacyPolicies: PrivacyPolicies,
    TermsCondition: TermsCondition,
    Reg: RegistrationNavigator,
    MyPayment: MyPaymentsScreen,
    Review: ReviewScreen,
  },
  {
    mode: 'modal',
    initialRouteName: 'Homes',
    headerMode: 'none',
    detachInactiveScreens: true,
    navigationOptions: {
      detachPreviousScreen: true,
    },
  },
);

const AstrologerNavigator = createStackNavigator(
  {
    astro_Home: Home_Screen,
    TotalPayment: TotalPaymentScreen,
    Following: FollowingScreen,
    StatusCheck: StatusCheckScreen,
    OperationLogbook: OperationLogbookScreen,
    AstrologerProfile: AstrologerProfileScreen,
    AstroPost: AstroPostScreens,
    Live: LiveScreen,
    writePost: writePostScreen,
    MyPosts: MyPostsScreen,
    MyMoments: MyMomentsScreen,
    OrderHistory: OrderHistoryScreen,
    // Chat: ChatScreen,
    LiveOrder: LiveOrderScreen,
    PranamGurujiOfficial: PranamGurujiOfficialScreen,
    ShortCut: ShortCutScreen,
    BlockList: BlockListScreen,
    Setting: SettingScreen,
    ChatList: ChatListScreen,
    GoLive: Broadcaster,
    // Streaming: Streaming,
    StartChat: StartChat,
    Doc_Chat: Doc_Chat,
    astro_dashboard: astro_dashboard,
    CallConfirm: CallConfirmScreen,
    OrderMissedTab: OrderMissedTab,
    chat_History: chat_History,
    call_History: call_History,
    show_FullImg: show_FullImg,
    vcDoc: vcDoc,
    vcPopup: vcPopup,
    callDoc: callDoc,
    callPopUp: callPopUp,
    EndLive: EndLive,
    Contact: ContactScreen,
    PrivacyPolicy: PrivacyPolicyScreen,
    TermsConditions: TermsConditionsScreen,
  },
  {
    mode: 'modal',
    initialRouteName: 'astro_Home',
    headerMode: 'none',
    detachInactiveScreens: true,
    navigationOptions: {
      detachPreviousScreen: true,
    },
  },
);

export const createRootNavigator = isLoggedIn => {
  const ROUTES = {
    LoggedOut: LoggedOutNavigator,
    LoggedIn: LoggedInNavigator,
    Astrologer: AstrologerNavigator,
  };

  let initialRouteName = 'LoggedOut';
  if (isLoggedIn !== null) {
    const {role} = isLoggedIn;
    if (role === 'customer') {
      initialRouteName = 'LoggedIn';
    } else if (role === 'expert') {
      initialRouteName = 'Astrologer';
    }
  }

  const RootNavigator = createSwitchNavigator(ROUTES, {initialRouteName});
  return RootNavigator;
};
