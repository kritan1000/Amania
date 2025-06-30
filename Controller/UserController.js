const Users = require('../model/userSchema');
 
const getAllEmployee = async (req, res) => {
    console.log("Fetching all employees");
 
    try {
        const users = await Users.findAll();
 
        if (users.length === 0) {
            return res.status(404).json({ message: "No employees found" });
        }
 
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
 
 
const saveAllEmployee = async (req, res) => {
    console.log("Saving all employees");
 
    try {
        // Destructure name and userId from request body
        const { name, userId } = req.body;
 
        // If either field is missing, return a 400 Bad Request
        if (!name || !userId) {
            return res.status(400).json({ message: "Name and User ID are required" });
        }
 
        // Create a new user in the database
        const newUser = await Users.create({ name, userId });
 
        // Return the newly created user with 201 Created status
        res.status(201).json(newUser);
    } catch (error) {
        // Log and return a 500 Internal Server Error in case of failure
        console.error("Error saving employee:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
 
 
module.exports = {
    getAllEmployee
  //  saveAllEmployee //  This will throw an error unless the function is uncommented
};
 
 
 