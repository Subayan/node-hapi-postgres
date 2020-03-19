const Hapi = require('@hapi/hapi');

const Joi = require('@hapi/joi');
const Qs = require('qs');
require('dotenv').config({ path: __dirname+'/.env' })

const { Pool, Client } = require('pg')
const client  = new Client({
  user: process.env.USER,
  host:  process.env.HOST,
  database:process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
})
client.connect()
const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        query: {
            parser: (query) => Qs.parse(query)
        }
    });

    server.route({
        method: 'GET',
        path: '/api/users',
        handler: async(request, h) => {
            try {
                
           

            let pageNo = request.query.pageNo;
            let itemsPerPage= request.query.itemsPerPage;
            let search= request.query.search;
            let startIndex = (pageNo-1) *  itemsPerPage;
            let users;
            if(search)
                users = await client.query(`select * from users WHERE "name" LIKE '%${search}%' OR "surname" LIKE '%${search}%' OFFSET ${startIndex} LIMIT ${itemsPerPage}`);
            else
                users = await client.query(`select * from users OFFSET ${startIndex} LIMIT ${itemsPerPage}`);

            let count =  await client.query(`select count(*) from users`);
            return { message: 'list of users', status: true, data: { users:users.rows, totalCount: count.rows[0].count } };
        } catch (error) {
                console.log(error);
                throw new Error(error);
        }
        },
        options: {
            validate: {
                query:Joi.object({ 
                    itemsPerPage: Joi.array().items(Joi.number().valid(10, 25, 50,100)).single().required(),
                    pageNo: Joi.number().min(1).required(),
                    search: Joi.string().min(2),
                  })
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/api/users',
        handler: async(request, h) => {
            try {
                let userData = request.payload 
                users = await client.query(`INSERT INTO public."User"(email, name, surname) VALUES ('${userData.email}', '${userData.name}',' ${userData.surname}');`);
                console.log(users);
            return { message: 'user added', status: true, users:users};
        } catch (error) {
                console.log(error);
                throw new Error(error);
        }
        },
        options: {
            validate: {
                payload:Joi.object({ 
                    email: Joi.string().email().required(),
                    name: Joi.string().required(),
                    surname: Joi.string().required(),
                  })
            }
        }
    });


    server.route({
        method: 'GET',
        path: '/api/tasks',
        handler: async(request, h) => {
            try{
                let pageNo = request.query.pageNo;
                let itemsPerPage= request.query.itemsPerPage;
                let startIndex = (pageNo-1) *  itemsPerPage;
                let search= request.query.search;
                let score
                if(request.query.score){
                    score = {
                        lt: request.query.score.lt || 0,
                        gt: request.query.score.gt || 5,
                    }
                }
               
                let users = request.query.users?request.query.users.split(','): null;   
                let status =request.query.status? request.query.status.split(','): null;     
                let whereCaluse = '';
                
                if(search){
                    whereCaluse += ` "name" LIKE '%${search}%' OR description LIKE '%${search}%' `;
                }
                console.log(users);
                if(users){
                    if(whereCaluse.length > 0)
                        whereCaluse += ` AND  `;

                    whereCaluse += `"userId" in (${users.toString()})`
                }

                if(status){
                    if(whereCaluse.length > 0)
                        whereCaluse += ` AND  `;

                    whereCaluse += `"status" in (${status.map( o=>{   return `'${o}'` }).join(",")})`
                }

                if(whereCaluse.length > 0)
                    whereCaluse += ` AND  `;
                
                whereCaluse += ` score >= 0  AND score <= 5 `;
                

                if(whereCaluse.length > 0)
                    whereCaluse = ` WHERE ` + whereCaluse;
               `SELECT * FROM public."Task" WHERE "id" in (1,2,3) AND status in ('ACTIVE', 'INACTIVE') AND score >= 0  AND score <= 5;`
                // if(search)
                // { 
                //     whereCaluse += `"name" LIKE '%${search}%' OR description LIKE '%${search}%'`
                // }
                    //  users = await client.query(`select * from tasks WHERE "name" LIKE '%${search}%' OR description LIKE '%${search}%' OFFSET ${startIndex} LIMIT ${itemsPerPage}`);
                // else
                console.log(`select * from "Task" ${whereCaluse} OFFSET ${startIndex} LIMIT ${itemsPerPage}`)
                users = await client.query(`select * from "Task" ${whereCaluse} OFFSET ${startIndex} LIMIT ${itemsPerPage}`);

                let count =  await client.query(`select count(*) from "Task" ${whereCaluse}`);
                return { message: 'list of users', status: true, data: { users:users.rows, totalCount: count.rows[0].count } };
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
        },
        options: {
            validate: {
                query:Joi.object({
                    itemsPerPage: Joi.array().items(Joi.number().valid(10, 25,50,100)).single().required(),
                    pageNo: Joi.number().min(1).required(),
                    search: Joi.string().min(2),
                    score: {
                        lt:Joi.number(),
                        gt:Joi.number()
                    },
                    users:  Joi.string(),
                    status: Joi.string()
                  })
            }
        }
    });
    server.route({
        method: 'POST',
        path: '/api/tasks',
        handler: async(request, h) => {
            try{
                let userData  = request.payload;
                userData.status   = 'ACTIVE';
                users = await client.query(`INSERT INTO public."Task"(
                        name, description, score, status, "projectId", "userId")
                        VALUES ('${userData.name}', '${userData.description}', '${userData.score}', '${userData.status}', '${userData.projectId}', '${userData.userId}');`);
               
                return { message: 'list of users', status: true, data: { users:users } };
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
        },
        options: {
            validate: {
                payload:Joi.object({
                    name:  Joi.string().min(2).required(),
                    description : Joi.string().min(2),
                    score:  Joi.number().min(0).max(5).required(),
                    projectId:Joi.number(),
                    userId:Joi.number()
                  })
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/api/projects',
        handler: async(request, h) => {
            try{
                let pageNo = request.query.pageNo;
                let itemsPerPage= request.query.itemsPerPage;
                let startIndex = (pageNo-1) *  itemsPerPage;
                let search= request.query.search;
              
              
                let users = request.query.users?request.query.users.split(','): null;   
                let status =request.query.status? request.query.status.split(','): null;     
                let whereCaluse = '';    
              
                
                if(search){
                    whereCaluse += ` "name" LIKE '%${search}%' OR body LIKE '%${search}%' `;
                }
                console.log(users);
                if(users){
                    if(whereCaluse.length > 0)
                        whereCaluse += ` AND  `;

                    whereCaluse += `"userId" in (${users.toString()})`
                }

                if(status){
                    if(whereCaluse.length > 0)
                        whereCaluse += ` AND  `;

                    whereCaluse += `"status" in (${status.map( o=>{   return `'${o}'` }).join(",")})`
                }
                

                if(whereCaluse.length > 0)
                    whereCaluse = ` WHERE ` + whereCaluse;
                console.log(`select * from "Task" ${whereCaluse} OFFSET ${startIndex} LIMIT ${itemsPerPage}`)
                users = await client.query(`select * from "Project" ${whereCaluse} OFFSET ${startIndex} LIMIT ${itemsPerPage}`);
                
                let count =  await client.query(`select count(*) from "Project" ${whereCaluse}`);
                return { message: 'list of users', status: true, data: { users:users.rows, totalCount: count.rows[0].count } };
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
        },
        options: {
            validate: {
                query:Joi.object({
                    itemsPerPage: Joi.array().items(Joi.number().valid(10, 25,50,100)).single().required(),
                    pageNo: Joi.number().min(1).required(),
                    search: Joi.string().min(2),
                    users:  Joi.string(),
                    status:  Joi.string()
                  })
            }
        }
    });
    server.route({
        method: 'POST',
        path: '/api/projects',
        handler: async(request, h) => {
            try{
               let userData  = request.payload;
               userData.status  = 'ACTIVE'
            

                users = await client.query(`INSERT INTO public."Project"(
                    name, body, status, "userId")
                    VALUES ('${userData.name}', '${userData.body}', '${userData.status}', '${userData.userId}');`);

              
                return { message: 'list of users', status: true, data: { users:users } };
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
        },
        options: {
            validate: {
                payload:Joi.object({
                    name: Joi.string().min(3).required(),
                    body: Joi.string().min(3).required(),
                    // status: Joi.string(),
                    userId:  Joi.number()
                  })
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};



process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();