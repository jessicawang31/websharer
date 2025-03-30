import express from 'express';

var router = express.Router();

router.get("/myIdentity", async function (req, res, next) {
  let session = req.session;
  if (session.isAuthenticated) {
    const userInfo = {
      name: session.account.name,
      username: session.account.username
    };
        
    res.json({status: "loggedin", userInfo});
  } else {
    res.json({status: "loggedout"});
  }
});  

// user info
router.get("/info", async function (req, res, next) {
  try {
    const {user} = req.query;
    if (!user) {
      return res.status(400).json({ status: "error", error: "Missing username"});
    }

    let userInfo = await req.models.UserInfo.findOne({username: user});

    if (!userInfo) {
      return res.json({
        username: user,
        email: user,
        fun_fact: "",
      });
    }
       
    res.json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({"status": "error", "error": err});
  }
});  

router.post('/info', async (req, res) => {
  let session = req.session;

  try {
      // user logged in? 401 error
      if (!session.isAuthenticated) {
          return res.status(401).json({"status": "error", error: "not logged in"});
      }

      // fun_fact
      const { fun_fact } = req.body;
      if (!fun_fact) {
        return res.status(400).json({ status: "error", error: "missing fun_fact" });
      }

      // new user in db
      const username = session.account.username;
      const email = session.account.username;

      let userInfo = await req.models.UserInfo.findOne({ username });

      if (!userInfo) {
        // Create new entry if user does not exist in DB
        userInfo = new req.models.UserInfo({
          username,
          email,
          fun_fact
        });
      } else {
        // update if user exists
        userInfo.email = email;
        userInfo.fun_fact = fun_fact;
      }
        
      await userInfo.save();
      res.json({"status": "success"});
  
  } catch(err) {
      console.log(err);
      res.status(500).json({"status": "error", "error": err});
  }
});

export default router;