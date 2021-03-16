module.exports = {
    user: process.env.ORACLE_USER || "system",
    password: process.env.ORACLE_PASSWORD || "ncdc1234",
    connectString: process.env.ORACLE_CONNECTSTRING || "localhost/XE"
}