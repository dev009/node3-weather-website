const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// define paths for express configs
const publicDirectoryPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))


app.get('', (request, response) => {
    response.render("index", {
        title: 'Weather',
        name: 'Deval'
    })
})

app.get('/about', (request, response) => {
    response.render("about", {
        title: 'About Me',
        name: 'Deval'
    })
})


app.get('/help', (request, response) => {
    response.render("help", {
        title: 'Help',
        message: 'Help message',
        name: 'Deval'
    })
})

app.get('/weather', (request, response) => {

    if (!request.query.address) {
        return response.send({
            error: 'You must provide a address'
        })
    }
    
    geocode(request.query.address,(error,{latitude,longitude, location} = {}) =>{
        if(error)
        {
            return response.send({error})
        }

        forecast(latitude,longitude,(error,forecastData) =>{
            if(error)
            {
                return response.send({error})
            }

            response.send({
                forecast:forecastData,
                location,
                address:request.query.address
            })

        })
    })

    
})

app.get('/products', (request, response) => {

    if (!request.query.search) {
        return response.send({
            error: 'You must provide a search term'
        })
    }

    console.log(request.query.search)
    response.send({
        products: []
    })
})


app.get('/help/*', (request, response) => {
    response.render("notfound", { title: "Help", message: "Help Article not found!", name: 'Deval' })
})

app.get('*', (request, response) => {
    response.render("notfound", { title: "Page Not Found", message: "My 404 Page!", name: 'Deval' })
})


app.listen(3000, () => {
    console.log('Server is up on port 3000')
})