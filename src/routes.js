const express = require("express")
const connection = require("./database/connection");
const { innerJoin, as } = require("./database/connection");

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
    let tools = ''
    if(tag){
        tools = await connection.raw(`
                SELECT DISTINCT 
                TL.id, TL.title, TL.link, TL.description 
                FROM tools TL 
                INNER JOIN tags TA ON TA.tool_id = TL.id 
                WHERE TA.name LIKE ?`, tag)
    } else {
        tools = await connection('tools').select('*')
    }

    const ref = await getData(tools)

    return res.json(ref)
})

routes.get('/tools/title/:title', async (req, res) => {
    const { title } = req.params
    const tools = await connection('tools').select('*').where('title', 'like', `%${title}%`)
    const ref = await getData(tools)
    return res.json(ref)
})

const getData = async tools => {

    const docs = await tools.map(async item => {
            
        const tags = await connection.raw(`
                SELECT * FROM tags 
                WHERE tool_id = ?
            `, item.id).then(function(rows){
                return rows;
            })

        const tagsName = []
        tags.forEach(element => {
            tagsName.push(element.name)
        });
        
        return {...item, tags: tagsName }

    })
    
    return Promise.all(docs)
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

routes.post('/tools', async (req, res) => {
    const { title, link, description, tags } = req.body

    

    let refTag = []
    if(tags !== ''){

        let aux = []
        if(typeof tags === 'string') {
            aux.push(tags)
        } else { 
            aux = tags
        }

        if(tags.indexOf(",") != -1){
            refTag = tags.split(',').map(function(item) {
                return item.trim();
            })
        }else{
            refTag = tags
        }  
    }
    /* console.log('Typeof tags', typeof tags)
    console.log('tags', tags)
    console.log('Typeof refTag', typeof refTag)
    console.log('refTag', refTag)

    return res.send('Ok') */

    
    if(title === '' || link === '' || description === '' || isEmpty(refTag)){
        return res.status(500).send('Falha, verifique os dados')
    }

    const tool_id = await connection('tools').insert({
        title, link, description
    })

    refTag.map(async name => {
        const tag_id = await connection('tags').insert({ tool_id, name })
    })

    const data = {
        id: tool_id[0], title, link, description, tags
    }

    return res.json(data)

})

routes.delete('/tools/:id', async (req, res) => {
    const { id } = req.params
    await connection('tools').where('id', id).delete()
    return res.status(204).send()
})

module.exports = routes