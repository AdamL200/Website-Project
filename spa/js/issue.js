/* issue.js */

console.log('ADD ISSUE PAGE')

import { customiseNavbar, file2DataURI, loadPage,loadPage2, router, showMessage } from '../util.js'

export async function setup(node) {
	console.log(' ISSUE: setup')
	try {
		console.log(node)
         
		document.querySelector('header p').innerText = 'Issue Page'
		document.querySelector('#technician').classList.add('hidden')
		customiseNavbar(['home', 'logout', 'addIssue', 'work'])
		if(localStorage.getItem('authorization') === null || localStorage.getItem('admin') == 0) {
			history.pushState(null, null, '/home')
			await router()
		}
		console.log(window.location.pathname.slice(7))
		if (window.location.pathname.slice(7).length <= 0) {
            console.log("id unspecified")
            await noIDcontent(node)
        } else{
            const id = window.location.pathname.slice(7)
            await idContent(node,id)
			const button1 = document.createElement('button')
			button1.id = "accept"
			button1.innerText = "Accept"
			const button2 = document.createElement('button')
			button2.id = "decline"
			button2.innerText = "Decline"
			const button3 = document.createElement('button')
			button3.id = "cancel"
			button3.innerText = "Cancel"
			node.appendChild(button1)
			node.appendChild(button2)
			node.appendChild(button3)
			node.querySelector('#accept').addEventListener('click',  function(){  acceptJob(id)})
			node.querySelector('#decline').addEventListener('click', declineJob)
			node.querySelector('#cancel').addEventListener('click', cancel)
        }

	} catch(err) {
		console.error(err)
		}
}

async function noIDcontent(node) {
    const title = document.createElement('h2')
    title.innerText = "You have not specified an id in the url\n "
    node.appendChild(title)
}

async function idContent(node, id) {
	console.log('func idContent')
    const title = document.createElement('h2')
    title.innerText = `welcome to issue ${id} `
    node.appendChild(title)
	
	document.querySelector('aside > p').innerText = 'LOADING'
	document.querySelector('aside').classList.remove('hidden')


	const url = `/api/issues/${id}`
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
	const template = document.querySelector('template#issue')
	console.log(json)
	const issue = json.data.issue[0] 
	const fragment = template.content
	fragment.querySelector('#age').innerText = issue.age
	fragment.querySelector('#appliance').innerText = issue.appliance
	fragment.querySelector('#date').innerText = issue.date
	fragment.querySelector('#description').innerText = issue.description
	fragment.querySelector('#location').innerText = issue.location
	fragment.querySelector('#manufacturer').innerText = issue.manufacturer
	fragment.querySelector('#pay').innerText = issue.pay
	fragment.querySelector('#status').innerText = issue.status
	fragment.querySelector('#summary').innerText = issue.summary
	fragment.querySelector('#technician').innerText = issue.technician
	fragment.querySelector('#username').innerText = issue.username
	node.appendChild(fragment)
	
	// hide "LOADING" message
	document.querySelector('aside').classList.add('hidden')
}

async function acceptJob(id) {
	console.log("Job accepted")
	const url = `/api/issues/${id}`
	const requestBody = {
		"type": "issue",
    	"attributes": {
        	"technician": localStorage.getItem('username')
		}
	}
	const options = {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/vnd.api+json',
			'Accept': 'application/vnd.api+json',
			'Authorization': `${localStorage.getItem('authorization')}`
		},
		body: JSON.stringify(requestBody) 
		
	}
	console.log("This is the data retrieved:")
	const response = await fetch(url, options)
	const json = await response.json()
	console.log(json)
	loadPage("work")
}

function declineJob() {
	console.log("Job declined")
}

function cancel() {
	loadPage('work')
}