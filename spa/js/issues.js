/* issues.js */



console.log('ISSUES PAGE')

import { customiseNavbar, file2DataURI, loadPage, router, showMessage } from '../util.js'

export async function setup(node) {
	console.log('ISSUES: setup')
	try {
		console.log(node)
		document.querySelector('header p').innerText = 'Issues Page'
		customiseNavbar(['home', 'logout', 'foo', 'issues'])
		if(localStorage.getItem('authorization') === null) {
			history.pushState(null, null, '/login')
			await router()
		}
		// there is a token in localstorage
		//console.log("THIS IS THE AUTH VARIABLE!")
		//console.log(localStorage.getItem('authorization'))
		console.log(window.location)
		node.querySelector('[name=age]').addEventListener('input', await updateAge)
		node.querySelector('[name=price]').addEventListener('input', await updatePrice)
		
		//const interval = 2000
		//window.setInterval( await updateBackground, interval )
		
		node.querySelector('form').addEventListener('submit', await addIssue)

	} catch(err) {
		console.error(err)
		}
}

async function updateAge(event) {
	const slider = document.querySelector('[name=age]')
    const output = document.querySelector('#ageOut')
    output.innerHTML = slider.value
}

async function updatePrice(event) {
	const slider = document.querySelector('[name=price]')
    const output = document.querySelector('#priceOut')
    output.innerHTML = slider.value
}

/*async function updateBackground(event){
	const heading = document.querySelector('header')
	heading.classList.toggle('purple')
    		if(heading.innerText != 'watch me change' ) {
    			heading.innerText = 'watch me change'
    		} else {
      			heading.innerText = 'Well this works'
    		}
} */

async function addIssue() { //gets the data from the form and posts it to the sql database [not finished]
	console.log('func addIssue')
	event.preventDefault()
	const formData = new FormData(event.target)
	const data = Object.fromEntries(formData.entries())
	console.log(data)

	const requestBody = {
		"type": "issue",
    	"attributes": {
        	"title": "Me mashin busted ",
			"appliance": "Washa Mashen",
			"age": 7,
        	"manufacturer": "Amazon Electric",
        	"description": "One day I was trying ta wosh da cloves but the machin did a backflip and died",
        	"pay": 70
    	}
	}
	const url = '/api/issues'
	//var credentials = btoa("${user}:${password}");
	//var auth = { "Authorization" : `Basic ${credentials}` };
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/vnd.api+json',
			'Accept': 'application/vnd.api+json',
			'Authorization': `${localStorage.getItem('authorization')}`
		},
		//body: JSON.stringify(data)
		body: JSON.stringify(requestBody) 
	}
	//const response = await fetch(url, options)
	//console.log(response)
	//const json = await response.json()
	//console.log(json)
	showMessage('new issue added!')
	loadPage('issues')
}


//check foo for an example of uploading data and auth
//still need to finish middleware?