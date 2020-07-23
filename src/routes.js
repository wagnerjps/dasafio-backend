const express = require("express")
const connection = require("./database/connection");

const routes = express.Router()

routes.get('/', (req, res) => {
    return res.json({
        titulo: "Hello World",
        evento: 'Backend is on!',
        autor: 'Wagner Silva'
    });
})

routes.get('/tools', async (req, res) => {
    const tag = req.query['tag']
    //console.log(tag)
    let tools = ''
    if(tag){
        tools = await connection('tools').select('*').where('tags', 'like', `%${tag}%`) //Aqui tem que verificar as tags
    } else {
        tools = await connection('tools').select('*')
    }
    return res.json(tools);
})

routes.get('/tools/title/:title', async (req, res) => {
    const { title } = req.params
    let tools = ''
    tools = await connection('tools').select('*').where('title', 'like', `%${title}%`)
    return res.json(tools);
})


routes.post('/tools', async (req, res) => {
    const { title, link, description, tags } = req.body

    const id = await connection('tools').insert({
        title, link, description, tags
    })

    const data = {
        id:  id[0], title, link, description, tags
    }
    return res.json(data)
})

routes.delete('/tools/:id', async (req, res) => {
    const { id } = req.params
    await connection('tools').where('id', id).delete()
    return res.status(204).send()
})

module.exports = routes