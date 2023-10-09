var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    process.env.PORT = 3002;
    process.env.TZ = 'Asia/India'
} else if (env === 'prod') {

}