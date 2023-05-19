const Tasks   = require("../models/task.js");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "newtonSchool";

/*

req.body = {
    "task_id"    : task_id,
    "token"      : token
}

Response

1. Unabel to verify token (Invalid Token)
404 Status Code
json = 
{
    status: 'fail',
    message: 'Invalid token'
}

2. if Given task_id does not exist in Tasks 

404 Status code

json = {
    status: 'fail',
    message: 'Given task doesnot exist'
}

3. if creator_id of task that belong to task_id is not same as userId that we get from payload of token
   means this is not the owner of given task hence

403 Status code
json = 
{
    status: 'fail',
    message: 'Access Denied'
}

4. if creator_id of task that belong to task_id is same as userId that we get from payload of token
   means this is the owner of given task hence

200 Status code with allowing further.

*/

async function isowner(req, res, next) {

    try {
        
        //Write your code here.
         // check token validity
        const { token, task_id } = req.body;
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(404).json({
                status: 'fail',
                message: 'Invalid token',
            });
        }

        // check if task exists
        const task = await Tasks.findById(task_id);
        if (!task) {
            return res.status(404).json({
                status: 'fail',
                message: 'Given task does not exist',
            });
        }

        // check if user is the creator of the task
        if (task.creator_id != decodedToken.userId) {
            return res.status(403).json({
                status: 'fail',
                message: 'Access Denied',
            });
        }

        // all checks passed, user can proceed
        next();

    } catch (err) {
        return res.status(400).json({
            status: "error",
            message: "Unable to check"
        })
    }
}

module.exports = { isowner };
