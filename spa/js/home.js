
/* home.js */

import { customiseNavbar } from '../util.js'

export async function setup(node) {
	console.log('HOME: setup')
	try {
		console.log(node)
		document.querySelector('header p').innerText = 'Home'
		customiseNavbar(['home', 'foo', 'logout', 'issues']) // navbar if logged in
		const token = localStorage.getItem('authorization')
		const admin = localStorage.getItem('admin')
		console.log(`admin = ${admin}`)
		console.log(token)
		if(token === null) {customiseNavbar(['home', 'register', 'login']) //navbar if logged out
		// add content to the page
		await addContent(node) //displays not logged in content
		} else {
		await addLoggedInContent(node, localStorage.getItem('admin')) //displays the content for logged in users
		}
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

async function addLoggedInContent(node,admin) {
	console.log('func addLoggedInContent')
	document.querySelector('aside > p').innerText = 'LOADING'
	document.querySelector('aside').classList.remove('hidden')


	const url = '/api/issues'
	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/vnd.api+json',
			'Accept': 'application/vnd.api+json',
			'Authorization': `${localStorage.getItem('authorization')}`
		},
		
	}
	console.log("This is the data retrieved:")
	const response = await fetch(url, options)
	console.log(response)
	const json = await response.json()
	//console.log(json)
	//console.log(json.data.issues[0]) //grabs a single issue
	if(localStorage.getItem('admin') == 0) { //logged in as customer
	const template = document.querySelector('template#customer')
	console.log(json)
	for(const issue of json.data.issues) {
		console.log(issue)
		const fragment = template.content.cloneNode(true)
		fragment.querySelector('#appliance').innerText = issue.appliance
		fragment.querySelector('#summary').innerText = issue.summary
		fragment.querySelector('#date').innerText = issue.date
		fragment.querySelector('#status').innerText = issue.status
		node.appendChild(fragment)
	}
	// hide "LOADING" message
	document.querySelector('aside').classList.add('hidden')
	}
}



