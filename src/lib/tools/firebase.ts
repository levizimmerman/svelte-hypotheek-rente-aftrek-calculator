import { memoize } from 'lodash';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
	apiKey: 'AIzaSyBrsKPtuEzPKr1UyDdSYhifezQrnxGZWGk',
	authDomain: 'berekenjenettomaandlasten.firebaseapp.com',
	projectId: 'berekenjenettomaandlasten',
	storageBucket: 'berekenjenettomaandlasten.appspot.com',
	messagingSenderId: '1048161735196',
	appId: '1:1048161735196:web:b6ce2bd2d8c7e9b913c5d9',
	measurementId: 'G-DLW1F688TN'
};

export const initFirebase = memoize(() => {
	const app = initializeApp(firebaseConfig);
	const analytics = getAnalytics(app);
	return {
		app,
		analytics
	};
});
