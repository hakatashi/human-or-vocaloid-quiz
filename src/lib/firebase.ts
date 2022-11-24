import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyAc5g_Rt_Jdmm-4oStzDsnuDIOgKBjuvpE',
	authDomain: 'hakatabot-firebase-functions.firebaseapp.com',
	databaseURL: 'https://hakatabot-firebase-functions.firebaseio.com',
	projectId: 'hakatabot-firebase-functions',
	storageBucket: 'hakatabot-firebase-functions.appspot.com',
	messagingSenderId: '993689875343',
	appId: '1:993689875343:web:3c660af6dfe2d7518711fa',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
