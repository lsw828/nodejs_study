
function basicAPI (req, res) {
  res.status(200).json(
    {
      "success" : true
    }
  );
}

function testAPI (req, res) {
  res.status(200).json(
    {
      "message" : "test"
    }
  );
}

function postTestAPI (req, res) {
  const user_message = req.body.message + "LSW";
  res.status(200).json(
    {
      "message" : user_message
    }
  );
}

module.exports = {
    basicAPI: basicAPI,
    testAPI: testAPI,
    postTestAPI: postTestAPI,
}