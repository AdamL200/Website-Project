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
		console.log(window.location)
		node.querySelector('#age').addEventListener('input', await updateAge)
		node.querySelector('#price').addEventListener('input', await updatePrice)
		
		//const interval = 2000
		//window.setInterval( await updateBackground, interval )
		
		node.querySelector('form').addEventListener('submit', await addIssue)

	} catch(err) {
		console.error(err)
		}
}

async function updateAge(event) {
	const slider = document.querySelector('#age')
    const output = document.querySelector('#ageOut')
    output.innerHTML = slider.value
}

async function updatePrice(event) {
	const slider = document.querySelector('#price')
    const output = document.querySelector('#priceOut')
    output.innerHTML = slider.value
}

//async function updateBackground(event){
//	const heading = document.querySelector('header')
//	heading.classList.toggle('purple')
//    		if(heading.innerText != 'watch me change' ) {
//    			heading.innerText = 'watch me change'
//    		} else {
//      			heading.innerText = 'Well this works'
//    		}
//}
async function addIssue() {
	console.log('func addIssue')
	event.preventDefault()
	const formData = new FormData(event.target)
	const data = Object.fromEntries(formData.entries())
	console.log(data)
	const url = '/api/issues'
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/vnd.api+json',
			'Accept': 'application/vnd.api+json'
		},
		body: JSON.stringify(data)
	}
	const response = await fetch(url, options)
	console.log(response)
	const json = await response.json()
	console.log(json)
	showMessage('new issue added!')
	loadPage('issues')
}


//check foo for an example of uploading data and auth
//still need to finish middleware?