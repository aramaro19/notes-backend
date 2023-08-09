const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('Please provide the passsword as an argument: node mongo.js <password>')
	process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://arobertamaro:${password}@cluster0.plvz6au.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
	content: String,
	date: Date,
	important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
	content: 'Another note',
	date: new Date(),
	important: false,
})

/*note.save().then(result => {
    console.log('note saved')
    mongoose.connection.close() 
})*/

Note.find({}).then(result => {
	result.forEach(note => {
		console.log(note)
	})
	mongoose.connection.close()
})
