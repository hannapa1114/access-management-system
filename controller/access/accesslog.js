const oracleDb = require('oracledb')
const query = require('../../query/query')
const { switchQueryLog } = require('../../query/func')

// select * from mains 
// where createdat between '2021-02-04 00:00:00' and '2021-02-04 23:59:59' 
// order by createdat desc;
module.exports = {
  get: async (req, res) => {
  
    await oracleDb.getConnection({
      user: 'datausr',
      password: 'nccrekr1!',
      connectString: '10.32.29.204:1521/kccsisdb',
    }, async (err, connection) => {
      await connection.execute(switchQueryLog(query.log), function (err, result) {
        if (err) {
          console.error(err)
          return;
        }
        oracleDb.autoCommit = true;
        //2차원 배열 각 엘리먼트(배열)를 data[{}, {}]객체로 변경
        //data(변경 엘리먼트 중) id가 같은 값이 있는지 확인 
        //없으면 새로운 객체 만들어서 push
        //있으면 해당 객체.files[]에 filename, path, size  객체만 push!
        let logData = []
        for (let i = 0; i < result.rows.length; i++) {
          if (logData.length === 0) {
            let obj = {}
            obj.id = result.rows[i][0]
            obj.workTarget = result.rows[i][1]
            obj.accessObj = result.rows[i][2]
            obj.company = result.rows[i][3]
            obj.representName = result.rows[i][4]
            obj.accessNum = result.rows[i][5]
            obj.confirmName = result.rows[i][6]
            obj.createdAt = result.rows[i][7]
            obj.updatedAt = result.rows[i][8]
            obj.files = []
            if (result.rows[i][12] !== null) {
              let fileObj = {}
              fileObj.mainId = result.rows[i][12]
              fileObj.fileName = result.rows[i][9]
              fileObj.filePath = result.rows[i][10]
              fileObj.fileSize = result.rows[i][11]
              obj.files.push(fileObj)
            }
            logData.push(obj)
          } else {
            if (logData.some(el => el.id === result.rows[i][0]) && result.rows[i][12] !== null) {

              let fileObj = {}
              fileObj.mainId = result.rows[i][12]
              fileObj.fileName = result.rows[i][9]
              fileObj.filePath = result.rows[i][10]
              fileObj.fileSize = result.rows[i][11]
              let index = logData.findIndex(el => el.id === result.rows[i][0])
              logData[index].files.push(fileObj)


            } else if (logData.some(el => el.id === result.rows[i][0]) === false) {
              let obj = {}
              obj.id = result.rows[i][0]
              obj.workTarget = result.rows[i][1]
              obj.accessObj = result.rows[i][2]
              obj.company = result.rows[i][3]
              obj.representName = result.rows[i][4]
              obj.accessNum = result.rows[i][5]
              obj.confirmName = result.rows[i][6]
              obj.createdAt = result.rows[i][7]
              obj.updatedAt = result.rows[i][8]
              obj.files = []
              if (result.rows[i][12] !== null) {
                let fileObj = {}
                fileObj.mainId = result.rows[i][12]
                fileObj.fileName = result.rows[i][9]
                fileObj.filePath = result.rows[i][10]
                fileObj.fileSize = result.rows[i][11]
                obj.files.push(fileObj)
              }
              logData.push(obj)
            } else {
              continue;
            }
          }

        }
       res.send(logData)
     })
    })
  }
}