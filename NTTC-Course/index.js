import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

const courses = [
    {
        id: 1,
        title: 'Cisco',
        descrption: 'Learn Cisco from cisco packet tracer',
        lesson: ['Get Started with Cisco Packet', 'Exploring Network', 'Exploring Internet']
    },
    {
        id: 2,
        title: 'Linux',
        descrption: 'Linux is an open-source operating system based on Unix.',
        lesson: ['installing Linux', 'Command Line Usage', 'File Management', 'Software installtion']
    },
];

app.get('/api/courses', (req, res) => {
    res.json(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    course ? res.json(course) : res.status(404).json({ message: 'Course not found' });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`);
});