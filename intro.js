const actions = [

    {
        type: "list",
        name: "actions",
        message: "What would you like to to?",
        choices: [

            "Add New Employee",
            "View All Employees",
            "Add Role",
            "Update Role",
            "View All Roles",
            "Add Department",
            "View All Departments",
            "Exit"

        ]

    }
]



module.exports = {
    actions
}