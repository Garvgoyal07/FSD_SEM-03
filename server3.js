const express = require('express');
const app = express();

app.use(express.json());

let students = [
    {id:1,name:"rahul",branch:"cse"},
    {id:2,name:"aman" , branch:"IT"}    
];
app.get('/',(req,res)=>{
    res.send("server is running");
});
app.get('/students',(req,res)=>{
    res.json(students);
})

app.post('/students',(req,res)=>{
    const newStudent =req.body;
    students.push(newStudent);
    res.status(201).json({message:"student added successfully " , student:newStudent });
});

app.listen(3005,()=>{
    console.log("server running at port 3005");
});


app.delete('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const student = students.find(s => s.id === id);
  
  if (!student) {
    return res.status(404).send({
      message: "Student not found"
    });
  }

  students = students.filter(s => s.id !== id);
  res.send({
    message: "Student deleted successfully",
    students: students
  });
});

// Start Server
app.listen(3005, () => {
  console.log('Server running at http://localhost:3005');
});