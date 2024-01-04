const express = require('express');
const app = express();
const port = 3013;
const { compare } = require('./pdf-comparission')


app.get('/', (req, res) => {
  res.send('File compare please use http://localhost:3013/filecompare');
});

app.get('/filecompare', async (req, res)=>{
    const file1Path = 'https://drive.google.com/file/d/1n6_U5qB3P52qctWX4pMJgnjSyquEIcar';
  const file2Path = 'https://drive.google.com/file/d/1k4Oso_aULBRMRTXRVwqU_Bk3K4P7c_u1';  
  // const file2Path = 'https://docs.google.com/file/d/0Bwec68rHFbJMQXFGTzg0V29fbE0/view?resourcekey=0-RWT_YdhAoqHOFy_ty7finw';
  const data = await compare(file1Path, file2Path);
  // console.log ('data==>', data)
  return res.send(data);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});