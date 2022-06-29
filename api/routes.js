
/* routes.js */

import { Router } from 'oak'

import { extractCredentials, dataURLtoFile } from 'util'
import { login, register, addIssue, getAdmin, getIssues, getIssue,putIssue} from 'accounts'

const router = new Router()

// the routes defined here
router.get('/', async context => {
	console.log('GET /')
	context.response.headers.set('Content-Type', 'text/html')
	const data = await Deno.readTextFile('spa/index.html')
	context.response.body = data
})

router.get('/api/accounts', async context => {
	console.log('GET /api/accounts')
	const token = context.request.headers.get('Authorization')
	console.log(`auth: ${token}`)
	context.response.headers.set('Content-Type', 'application/json')
	try {
		const credentials = extractCredentials(token)
		console.log(credentials)
		const username = await login(credentials)
		const admin = await getAdmin(username)
		context.response.body = JSON.stringify(
			{
				data: { username, admin }
				//data: {username}
			}, null, 2)
	} catch(err) {
		err.data = {
			code: 401,
			title: '401 Unauthorized',
			detail: err.message
		}
		throw err
	}
})

router.post('/api/accounts', async context => {
	console.log('POST /api/accounts')
	const body  = await context.request.body()
	const data = await body.value
	console.log(data)
	await register(data)
	context.response.status = 201
	context.response.body = JSON.stringify({ status: 'success', msg: 'account created' })
})

router.post('/api/files', async context => {
	console.log('POST /api/files')
	try {
		const token = context.request.headers.get('Authorization')
		console.log(`auth: ${token}`)
		const body  = await context.request.body()
		const data = await body.value
		console.log(data)
		dataURLtoFile(data.base64, data.user)
		context.response.status = 201
		context.response.body = JSON.stringify(
			{
				data: {
					message: 'file uploaded'
				}
			}
		)
	} catch(err) {
		err.data = {
			code: 500,
			title: '500 Internal Server Error',
			detail: err.message
		}
		throw err
	}
})

router.get('/api/issues', async context => { 
	console.log('GET /api/issues')
	context.response.headers.set('Content-Type', 'application/vnd.api+json')
	
	let issues
	try {
		issues = await getIssues()

		context.response.body = JSON.stringify(
			{
				data: { issues }
			}, null, 2)
	} catch(err) {
		err.data = {
			code: 401,
			detail: err.message
		}
		throw err
	}
	context.response.status = 201
}) 

router.post('/api/issues', async context => {
	console.log('POST /api/issues')
	const body  = await context.request.body()
	const data = await body.value
	console.log(data)
	await addIssue(data) 
	context.response.status = 201
	context.response.body = JSON.stringify({ status: 'success', msg: 'issue added' })
})

router.get('/api/issues/:id', async context => { 
	console.log(`GET /api/issue/${context.params.id}`)
	console.log(context.params.id)
	context.response.headers.set('Content-Type', 'application/vnd.api+json')
	
	let issue
	try {
		issue = await getIssue(context.params.id)

		context.response.body = JSON.stringify(
			{
				data: { issue }
			}, null, 2)
	} catch(err) {
		err.data = {
			code: 401,
			detail: err.message
		}
		throw err
	}
	context.response.status = 201
}) 

router.put('/api/issues/:id', async context => { 
	console.log(`PUT /api/issues/${context.params.id}`)
	context.response.headers.set('Content-Type', 'application/vnd.api+json')
	const body = await context.request.body()
	console.log(body)
	const data = await body.value
	console.log(data)
	let issue
	try {
		issue = await putIssue(data, context.params.id)

		context.response.body = JSON.stringify({ status: 'success', msg: 'issue updated' })

	} catch(err) {
		err.data = {
			code: 401,
			detail: err.message
		}
		throw err
	}
	context.response.status = 201
}) 

export default router

