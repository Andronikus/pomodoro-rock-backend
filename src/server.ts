import app from './app';


app.listen(app.get('port'), () => {
    console.log(`server is listen to at port ${app.get('port')}`)
})
