'use strict';

const express = require('express');
// const parser = require('body-parser');
const compression = require('compression');

const app = express();
app.use(compression());
app.use('/', express.static('dist'));
app.use('/new-messages', express.static('dist'));
app.use('/new-messages/:id', express.static('dist'));
app.use('/new-messages/:id/info', express.static('dist'));
app.use('/active-messages', express.static('dist'));
app.use('/active-messages/:id', express.static('dist'));
app.use('/active-messages/:id/info', express.static('dist'));
app.use('/closed-messages', express.static('dist'));
app.use('/closed-messages/:id', express.static('dist'));
app.use('/closed-messages/:id/info', express.static('dist'));
app.use('/signin', express.static('dist'));

app.listen(process.env.PORT || 2999, () =>{
	console.log(`App started on port ${process.env.PORT || 3000}`);
});
