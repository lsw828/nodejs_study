const express = require('express')
const router = express.Router()

const mysql = require('mysql')		// node-mysql을 install하고 모듈을 불러와야한다.
const conn = mysql.createConnection({ // mysql과 connection하는 부분
  host     : '127.0.0.1',
  user     : 'root',
  password : '1234',
  database : 'myapp_db',
})

conn.connect(function(err) {
  if (err) {
    console.log("Oops... Something went wrong"); 
    console.log(err);
  } else {
    console.log("DB Connected!");
  }
});

// POST method 처리시 필요함
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

//////////////////////////////////
// ARRAY
/*
let users = [
  {
    id: 1,
    name: 'alice'
  },
  {
    id: 2,
    name: 'bek'
  },
  {
    id: 3,
    name: 'chris'
  }
]

// Read : all
router.get('/', (req, res) => {
  console.log(users)
  return res.json(users)
})

// Read
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  if (!id) {  // NaN
    return res.status(400).json({error: 'Incorrent id'})
  }

  let user = users.filter(user => user.id === id)[0]
  if (!user) {
    return res.status(404).json({error: 'Unknown user'})
  }

  return res.json(user)
})

// Create
router.post('/', (req, res) => {
  const name = req.body.name || ''
  if (!name.length) {
    return res.status(400).json({error: 'Incorrenct name'});
  }

  const id = users.reduce((maxId, user) => {
    return user.id > maxId ? user.id : maxId
  }, 0) + 1

  const newUser = {
    id: id,
    name: name
  }

  users.push(newUser)
  return res.status(201).json(newUser)
})

// Delete
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  if (!id) {  // NaN
    return res.status(400).json({error: 'Incorrent id'})
  }

  const userIdx = users.findIndex(user => {
    return user.id === id;
  })
  if (userIdx === -1) {
    return res.status(404).json({error: 'Unknown user'})
  }

  users.splice(userIdx, 1)
  return res.status(200).json({id: userIdx})
})
*/

//////////////////////////////////
// Database (MySQL)
// Read : all
router.get('/', (req, res) => {
  var sql = 'SELECT * FROM users';
  conn.query(sql, function(err, rows, fields){
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error!")
    } else {
      var resultArray = Object.values(JSON.parse(JSON.stringify(rows)))
      console.log(resultArray)
      return res.status(200).json(resultArray)
    }
  })
})

// Read
router.get('/:id', (req, res) => {
  console.log("get()")

  const id = parseInt(req.params.id, 10)
  if (!id) {  // NaN
    return res.status(400).json({error: 'Incorrent id'})
  }

  var sql = 'SELECT * FROM users WHERE id = ?'
  var params = [id]
  conn.query(sql, params, function(err, rows, fields){
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error!")
    } else {
      if (!rows.length) {
        return res.status(404).json({error: 'Unknown user'})
      } else {
        var resultArray = Object.values(JSON.parse(JSON.stringify(rows)))
        console.log(resultArray[0])
        return res.status(200).json(resultArray[0])
      }
    }
  })
})

// Create
router.post('/', (req, res) => {
  console.log("post()")

  const name = req.body.name || ''
  if (!name.length) {
    return res.status(400).json({error: 'Incorrenct name'});
  }

  var sql = 'INSERT INTO users (name) VALUES (?)'
  var params = [name]
  conn.query(sql, params, function(err, rows, fields){
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error!")
    } else {
      const newUser = {
        id: rows.insertId,
        name: name
      }
      console.log(newUser)
      return res.status(201).json(newUser)
    }
  })
})

// Delete
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  if (!id) {  // NaN
    return res.status(400).json({error: 'Incorrent id'})
  }
  
  var sql = 'DELETE FROM users WHERE id = ?'
  var params = [id]
  conn.query(sql, params, function(err, rows, fields){
    if (err) {
      console.log(err)
      res.status(500).send("Internal Server Error!")
    } else {
      console.log(rows)
      if (rows.affectedRows) {
        return res.status(200).json({id: id})  
      } else {
        return res.status(400).json({error: 'Incorrent id'})
      }
    }
  })
})

// Update
router.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  if (!id) {  // NaN
    return res.status(400).json({error: 'Incorrent id'})
  }
  
  const name = req.body.name || ''
  if (!name.length) {
    return res.status(400).json({error: 'Incorrenct name'});
  }

  var sql = 'UPDATE users SET name=? WHERE id=?'
  var params = [name, id]
  conn.query(sql, params, function(err, rows, fields){
    if (err) {
      console.log(err)
      res.status(500).send("Internal Server Error!")
    } else {
      console.log(rows)
      if (rows.affectedRows) {
        const updatedUser = {
          id: id,
          name: name
        }
        console.log(updatedUser)
        return res.status(200).json(updatedUser)
      } else {
        return res.status(400).json({error: 'Incorrent id'})
      }
    }
  })
})


module.exports = router
