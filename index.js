require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const Note = require('./models/note');

app.use(express.static('build'));
app.use(express.json());
app.use(cors());

app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (request, response) => {
	Note.find({}).then(notes => {
		response.json(notes);
	});
});

app.get('/api/notes/:id', (request, response, next) => {
	Note.findById(request.params.id)
		.then(note => {
			if (note) {
				response.json(note);
			} else {
				response.status(404).end();
			}
		})
		.catch(error => next(error));
});

app.put('/api/notes/:id', (request, response) => {
	Note.findByIdAndUpdate(request.body.id, request.body, {new: true})
	.then(updatedNote => {
		response.json(updatedNote)
	})
})

app.post('/api/notes', (request, response, next) => {
	const body = request.body;

	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
	});

	note
		.save()
		.then(savedNote => savedNote.toJSON())
		.then(savedAndFormattedNote => response.json(savedAndFormattedNote))		
		.catch(error => next(error));
});

app.delete('/api/notes/:id', (request, response, next) => {
	Note.findByIdAndRemove(request.params.id)
	.then(deletedNote => {
		response.status(204).end()
	});
});

const errorHanlder = (error, request, response, next) => {
	console.error(error);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'Malformatted id' });
	}
	if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message });
	}
	next(error);
};

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

app.use(errorHanlder);
app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
