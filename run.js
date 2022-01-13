const pm2 = require('pm2');

pm2.connect((error) => {
    if (error) {
        console.error(error);
    }
    
    pm2.start({
        script: 'app.js',
        max_memory_restart: '1G'
    }, (error, app) => {
        if (error) {
            console.error(error); 
        }
    })
})