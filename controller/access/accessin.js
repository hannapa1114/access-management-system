const oracleDb = require('oracledb')
const query = require('../../query/query')
const { switchQueryLog } = require('../../query/func')
const formidable = require('formidable')
const fs = require('fs')
const mv = require('mv');

module.exports = { 
  post: async (req, res) => { 
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {

    const { workTarget, accessObj, company, representName, accessNum, confirmName, createdAt, workLog } = fields;
    await oracleDb.getConnection({
          user: 'datausr',
          password: 'nccrekr1!',
          connectString: '10.32.29.204:1521/kccsisdb',
    }, async (err, connection) => {
          const access = {
            WORKTARGET: workTarget,
            ACCESSOBJ: accessObj,
            COMPANY: company,
            REPRESENTNAME: representName,
            ACCESSNUM: accessNum,
            CONFIRMNAME: confirmName,
            CREATEDAT: createdAt,
            UPDATEDAT: createdAt,
          }
          //신규 입실 insert 쿼리 실행
          await connection.execute(query.in, access, async (err, result) => {
            if (err) {
              console.error(err)
            }

            oracleDb.autoCommit = true;
            //당일 출입이력 select 쿼리 실행
            await connection.execute(switchQueryLog(query.log), async (err, result) => {
              let detail = {
                SUMMARY: workLog,
                MAINID: 0
              }
              
              //-->신규생성 데이터 id값 얻기
              let mainId = 0;
              for (let i = 0; i < result.rows.length; i++) {
                if (result.rows[i][3] === company && result.rows[i][4] === representName && result.rows[i][7] === createdAt) {
                  // console.log('id = ', result.rows[i][0])
                  mainId = result.rows[i][0]
                }
              }
              detail.MAINID = mainId;
              //<--신규생성 데이터 id값 얻기

              //-->작업내역 요약 insert 쿼리 실행
              await connection.execute(query.sum, detail, async (err, result) => {
                if (err) {
                  console.error(err)
                }

              })
              //<--작업내역 요약 insert 쿼리 실행

              //-->작업내역file insert 쿼리 실행
              let fileArray = []

              if (Object.keys(files).length > 0) {
                for (let key in files) {
                  let fileObj = {}
                  var oldpath = files[key].path;
                  var newpath = '/home/ams/uploads/' + files[key].name;

                  mv(oldpath, newpath, function(err) {
                    next(err)
                  });
                  // 드라이버 간 파일 이동시 오류 발생 c: -> d:
                  // fs.rename(oldpath, newpath, function (err) {
                  //   if (err) throw err
                  // })

                  fileObj.name = files[key].name
                  fileObj.path = newpath
                  fileObj.size = files[key].size
                  fileArray.push(fileObj)
                }

                for (let i = 0; i < fileArray.length; i++) {
                  await connection.execute(query.file, {
                    FILENAME: fileArray[i].name,
                    FILEPATH: fileArray[i].path,
                    FILESIZE: fileArray[i].size,
                    MAINID: mainId
                  }, async (err, result) => {
                    if (err) {
                      console.error(err)
                    }
                  })
                }
              }
              //<--작업내역file insert 쿼리 실행
            })
             //<--당일 출입이력 select 쿼리 실행
            res.send('access!')
          })
          //신규 입실 insert 쿼리 실행
      })
    })
  }
}
