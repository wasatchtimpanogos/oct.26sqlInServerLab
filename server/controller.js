require('dotenv').config()

const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})






let nextEmp = 5

module.exports = {
    getUpcomingAppointments: (req, res) => {
        sequelize.query(`select a.appt_id, a.date, a.service_type, a.approved, a.completed, u.first_name, u.last_name 
        from cc_appointments a
        join cc_emp_appts ea on a.appt_id = ea.appt_id
        join cc_employees e on e.emp_id = ea.emp_id
        join cc_users u on e.user_id = u.user_id
        where a.approved = true and a.completed = false
        order by a.date desc;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },
    approveAppointment: (req, res) => {
        let {apptId} = req.body

        sequelize.query(`update cc_appointments set approved = true
        where appt_id = ${apptId};
        
        insert into cc_emp_appts (emp_id, appt_id)
        values (${nextEmp}, ${apptId}),
        (${nextEmp + 1}, ${apptId});
        `)
            .then(dbRes => {
                res.status(200).send(dbRes[0])
                nextEmp += 2
            })
            .catch(err => console.log(err))
    },

    //1. In controller.js’s export object, write a new function called getAllClients (make sure it accepts req & res)
    //2. Using sequelize.query query your database for all the columns in both 
    //cc_users and cc_clients joining them where the user_id column matches
    //3. Handle the promise with .then() passing in a callback: dbRes => res.status(200).send(dbRes[0]) (you can also add a .catch)

    getAllClients: (req, res) => {
        sequelize.query(`select * from cc_clients c
        join cc_users u on c.user_id = u.user_id;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    }, 
    getPendingAppointments: (req, res) => {
        sequelize.query(`select * from cc_appointments
        where approved = false
        order by date desc;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },
    getPastAppointments: (req, res) => {
        sequelize.query(`select a.appt_id, a.date, a.service_type, a.notes, u.first_name, u.last_name 
        FROM cc_appointments a
        JOIN cc_emp_appts ea ON a.appt_id = ea.appt_id
        JOIN cc_employees e ON e.emp_id = ea.emp_id
        JOIN cc_users u ON e.user_id = u.user_id
        WHERE a.approved = true and a.completed = true
        ORDER BY a.date DESC;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },
    completeAppointment: (req, res) => {
        let {apptId} = req.body

        sequelize.query(`update cc_appointments set completed = true
        where appt_id = ${apptId};`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    }


}








