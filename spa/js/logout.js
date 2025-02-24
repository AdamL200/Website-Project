
/* logout.js */

import { customiseNavbar, loadPage, showMessage } from '../util.js'

export async function setup(node) {
	try {
		console.log('LOGOUT: setup')
		customiseNavbar(['home', 'addIssue'])
		document.querySelector('#technician').classList.add('hidden')
		node.querySelectorAll('button').forEach( button => button.addEventListener('click', event => {
			console.log(event.target.innerText)
			if(event.target.innerText === 'OK') {
				localStorage.removeItem('username')
				localStorage.removeItem('authorization')
				localStorage.removeItem('admin')
				loadPage('login')
				showMessage('you are logged out')
			} else {
				loadPage('foo')
			}
		}))
	} catch(err) {
		console.error(err)
	}
}
