
/* home.js */

import { customiseNavbar } from '../util.js'

export async function setup(node) {
	console.log('HOME: setup')
	try {
		console.log(node)
		document.querySelector('header p').innerText = 'Home'
		customiseNavbar(['home', 'foo', 'logout', 'issues']) // navbar if logged in
		const token = localStorage.getItem('authorization')
		console.log(token)
		if(token === null) customiseNavbar(['home', 'register', 'login']) //navbar if logged out
		// add content to the page
		await addContent(node)
	} catch(err) {
		console.error(err)
	}
}

// this example loads the data from a JSON file stored in the uploads directory
async function addContent(node) {
	// show "LOADING" message
	document.querySelector('aside > p').innerText = 'LOADING'
	document.querySelector('aside').classList.remove('hidden')
	const response = await fetch('/uploads/machines.json')
	const issues = await response.json()
	const template = document.querySelector('template#quote')
	for(const issue of issues.data) {
		const fragment = template.content.cloneNode(true)
		fragment.querySelector('h2').innerText = issue.title
		fragment.querySelector('#appliance').innerText = issue.appliance
		fragment.querySelector('#age').innerText = issue.age
		fragment.querySelector('#manufacturer').innerText = issue.manufacturer
		fragment.querySelector('#description').innerText = issue.description
		fragment.querySelector('#pay').innerText = issue.pay
		node.appendChild(fragment)
	}
	// hide "LOADING" message
	document.querySelector('aside').classList.add('hidden')
}



