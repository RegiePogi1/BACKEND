const express = require('express');
const bodyParser = require('body-parser');

// routes here
const authRoutes = require('./routes/authroutes');
const userRoute = require('./routes/userRoute');
const deptRoutes = require('./routes/deptRoutes');
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());


// endpoint here    
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoute);
app.use('/api/dept', deptRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/student', studentRoutes);

const PORT = 4040;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
