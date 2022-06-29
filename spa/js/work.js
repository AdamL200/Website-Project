/* work.js */



console.log('WORK PAGE')

import { customiseNavbar, file2DataURI, loadPage,loadPage2, router, showMessage } from '../util.js'

export async function setup(node) {
	console.log('WORK: setup')
	try {
		console.log(node)
		customiseNavbar(['home', 'logout', 'issues'])
		document.querySelector('#technician').classList.add('hidden')
		if(localStorage.getItem('authorization') === null || localStorage.getItem('admin') != 1 ) {
			history.pushState(null, null, '/login')
			await router()
		}
		document.querySelector('header p').innerText = 'Work Page'
		// there is a token in localstorage
		//console.log("THIS IS THE AUTH VARIABLE!")
		//console.log(localStorage.getItem('authorization'))
		console.log(window.location)
		await addWorkContent(node)
		node.querySelector('#detailBtn').classList.add("hidden")
		node.querySelectorAll('#detailBtn').forEach(item =>{
			item.addEventListener('click', goDetails)
		})
		//const interval = 2000
		//window.setInterval( await updateBackground, interval )


	} catch(err) {
		console.error(err)
		}
}

async function addWorkContent(node) {
	console.log('func addWorkContent')
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

	//const detailBtn = document.createElement('button')
	//detailBtn.type = 'button'
	//detailBtn.innerText = 'Details'
	//detailBtn.addEventListener('click', printOne)

	const template = document.querySelector('template#work')
	console.log(json)
	for(const issue of json.data.issues) {
		console.log(issue)
		const fragment = template.content.cloneNode(true)
		fragment.querySelector('#id').innerText = issue.id
		fragment.querySelector('#distance').innerText = issue.location
		fragment.querySelector('#appliance').innerText = issue.appliance
		fragment.querySelector('#summary').innerText = issue.description
		fragment.querySelector('#pay').innerText = `£${issue.pay}`
		node.appendChild(fragment)
		
	}
	// hide "LOADING" message
	document.querySelector('aside').classList.add('hidden')

	
}

function goDetails() {
	console.log("godetails")
	console.log(this.parentNode.children[0].innerText)
	let id = this.parentNode.children[0].innerText
	loadPage2("issue",id)
}

