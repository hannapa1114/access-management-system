module.exports = {
    switchQueryOut: (query, company, represent, cre, uda) => {
        let result1 = '', result2 = '', result3 = '', result4 = ''

        let re1 = /:[U]+[P]+[D]+[A]+[T]+[E]+[D]+[A]+[T]/g
        let re2 = /:[C]+[O]+[M]+[P]+[A]+[N]+[Y]/g
        let re3 = /:[R]+[E]+[P]+[R]+[E]+[S]+[E]+[N]+[T]+[N]+[A]+[M]+[E]/g
        let re4 = /:[C]+[R]+[E]+[A]+[T]+[E]+[D]+[A]+[T]/g

        result1 = query.replace(re1, `'${uda}'`)
        result2 = result1.replace(re2, `'${company}'`)
        result3 = result2.replace(re3, `'${represent}'`)
        result4 = result3.replace(re4, `'${cre}'`)

        console.log(result4)
        return result4
    },
    switchQueryLog: (query) => {
        const getTodayDate = () => {
            let today = new Date();
            let y = today.getFullYear();
            let m = String(today.getMonth() + 1).padStart(2, '0');
            let d = String(today.getDate()).padStart(2, '0');

            let ymd = y + '-' + m + '-' + d;
            return ymd;
        }
        let result1 = '', result2 = ''

        let re1 = /:[S]+[T]+[A]+[R]+[T]/g
        let re2 = /:[E]+[N]+[D]/g

        result1 = query.replace(re1, getTodayDate)
        result2 = result1.replace(re2, getTodayDate)

        return result2
    }
}