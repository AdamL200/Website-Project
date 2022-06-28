
/* accounts.js */

import { compare, genSalt, hash } from 'bcrypt'
import { db } from 'db'

const saltRounds = 10
const salt = await genSalt(saltRounds)

export async function login(credentials) {
	const { user, pass } = credentials
	let sql = `SELECT count(id) AS count FROM accounts WHERE user="${user}";`
	let records
	try {
		records = await db.query(sql)
	} catch(err) {
		console.log('connection login error thrown', err)
		err.data = {
			code: 500,
			title: '500 Internal server error',
			detail: 'the API database is currently down'
		}
		throw err
	}
	if(!records[0].count) {
		const err = new Error()
		err.data = {
			code: 401,
			title: '401 Unauthorized',
			detail: `username '${user}' not found`
		}
		throw err
	}
	sql = `SELECT pass FROM accounts WHERE user = "${user}";`
	records = await db.query(sql)
	const valid = await compare(pass, records[0].pass)
	if(valid === false) {
		const err = new Error()
		err.data = {
			code: 401,
			title: '401 Unauthorized',
			detail: `invalid password for account '${user}'`
		}
		throw err
	}
	return user
}

export async function getAdmin(username) {
    let admin 
	let sql = `SELECT admin FROM accounts WHERE user="${username}";`
	let record
	try {
		record = await db.query(sql)
	} catch(err) {
		console.log('Admin checking error', err)
		err.data = {
			code: 500,
			title: '500 Internal server error',
			detail: 'the API database is currently down'
		}
		throw err
	}
	admin = record[0].admin
	console.log(admin)
	return admin
}

export async function register(credentials) {
	credentials.pass = await hash(credentials.pass, salt)
	const sql = `INSERT INTO accounts(user, pass) VALUES("${credentials.user}", "${credentials.pass}")`
	console.log(sql)
	await db.query(sql)
	return true
}

export async function addIssue(issueData) {
	console.log("----------------------------------")
	console.log(issueData)
	console.log("2---------------------------------")
	const sql = `INSERT INTO issues(appliance,age,manufacturer,summary,description,pay, username,date,status,technician, location)
	VALUES("${issueData.attributes.appliance}", "${issueData.attributes.age}", "${issueData.attributes.manufacturer}", "${issueData.attributes.title}", "${issueData.attributes.description}", "${issueData.attributes.pay}", "${issueData.attributes.username}", "${issueData.attributes.date}", "${issueData.attributes.status}", "${issueData.attributes.technician}", "${issueData.attributes.location}");`
	console.log(sql)
	await db.query(sql)
	return true
}

export async function getIssues() {
	let issues
	console.log("getIssues function")
	const sql = 'SELECT * FROM issues;'
	try{
		issues = await db.query(sql)
	}catch(err) {
		console.log('Get issues error', err)
		err.data = {
			code: 500,
			title: '500 Internal server error',
			detail: 'the API database is currently down'
		}
		throw err
	}
	//issues = JSON.stringify(issues)
	return issues
}

export async function getIssue(id) {
	let issue
	console.log(`getIssue function id=${id}`)
	const sql = `SELECT * FROM issues WHERE id=${id};`
	try{
		console.log(sql)
		issue = await db.query(sql)
		if(issue.length === 0) throw new Error('record not found')
		context.response.status = Status.ok
	}catch(err) {
		console.log('Get issue error', err)
		err.data = {
			code: 500,
			title: '500 Internal server error',
			detail: 'the API database is currently down'
		}
		throw err
	}
	//issues = JSON.stringify(issues)
	return issue
}