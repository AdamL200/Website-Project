
/* home.js */

import { customiseNavbar } from '../util.js'

export async function setup(node) {
	console.log('HOME: setup')
	try {
		console.log(node)
		document.querySelector('header p').innerText = 'Home'
		 // navbar if logged in
		const token = localStorage.getItem('authorization')
		const admin = localStorage.getItem('admin')
		if(token === null) {customiseNavbar(['home', 'register', 'login']) //navbar if logged out
		// add content to the page
		await addContent(node) //displays not logged in content
		} 
		if (admin == 0){
			customiseNavbar(['home', 'logout', 'addIssue'])
			await addCustomerContent(node) //displays the content for logged in users
		} 
		if (admin == 1){

			customiseNavbar(['home', 'logout', 'addIssue','work'])
			await addAdminContent(node)
		}
		
		/*const button = document.createElement("button")
		button.innerText = "Random Color!"
		button.type = "button"
		button.addEventListener('click', setAniBackground)
		node.appendChild(button) */



	} catch(err) {
		console.error(err)
	}
}

// this example loads the data from a JSON file stored in the uploads directory
async function addContent(node) {
	// show "LOADING" message
	document.querySelector('aside > p').innerText = 'LOADING'
	document.querySelector('aside').classList.remove('hidden')
	document.querySelector('#technician').classList.add('hidden')

	const url = '/api/issues'
	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/vnd.api+json',
			'Accept': 'application/vnd.api+json'
			//'Authorization': `${localStorage.getItem('authorization')}`
		},
		
	}
	console.log("This is the data retrieved:")

	//const response = await fetch('/uploads/machines.json')
	const response = await fetch(url, options)
	const json = await response.json()
	const template = document.querySelector('template#quote')
	for(const issue of json.data.issues) {
		const fragment = template.content.cloneNode(true)
		fragment.querySelector('h2').innerText = issue.summary
		fragment.querySelector('h2').innerText = issue.summary
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

async function addCustomerContent(node) {
	console.log('func addCustomerContent')
	document.querySelector('aside > p').innerText = 'LOADING'
	document.querySelector('aside').classList.remove('hidden')
	document.querySelector('#technician').classList.add('hidden')

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
	const template = document.querySelector('template#customer')
	console.log(json)
	for(const issue of json.data.issues) {
		if (issue.username == localStorage.getItem('username')) {
		console.log(issue)
		const fragment = template.content.cloneNode(true)
		fragment.querySelector('#appliance').innerText = issue.appliance
		fragment.querySelector('#summary').innerText = issue.summary
		fragment.querySelector('#date').innerText = issue.date.slice(0,8)
		fragment.querySelector('#status').innerText = issue.status
		node.appendChild(fragment)
		}
	}
	// hide "LOADING" message
	document.querySelector('aside').classList.add('hidden')
	
}


async function addAdminContent(node) {
	console.log('func addAdminContent')
	document.querySelector('aside > p').innerText = 'LOADING'
	document.querySelector('aside').classList.remove('hidden')
	document.querySelector('#technician').classList.remove('hidden')



	// hide "LOADING" message
	document.querySelector('aside').classList.add('hidden')
}

function setBackground() { //sets random bg color by click
    var color1 = random_rgba()
	var color2 = random_rgba()
	var color3 = random_rgba()
	var color4 = random_rgba()
	var color5 = random_rgba()
	var color6 = random_rgba()
	var color7 = random_rgba()
	document.body.style.backgroundImage = `linear-gradient(to bottom right,${color1},${color2},${color3},${color4},${color5},${color6},${color7})`

}

function setBackground2() { //sets bg color by interval once button clicked
	const interval = 2000
    window.setInterval(  updateBackground, interval )
}

function updateBackground(){
	let randomColor 
	randomColor = Math.floor(Math.random()*16777215).toString(16)
	document.body.style.backgroundColor = "#" + randomColor
	return true
}

function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}

function setAniBackground(){
	document.querySelector('main').classList.add("wrapper")
	document.querySelector('footer').classList.add("wrapper")
	document.querySelector('body').classList.add("wrapper")
}
